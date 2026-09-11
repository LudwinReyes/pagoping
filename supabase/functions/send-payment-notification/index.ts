// Supabase Edge Function: send-payment-notification
// Uses FCM v1 API with Service Account authentication
//
// Deploy: supabase functions deploy send-payment-notification

import { createClient } from 'npm:@supabase/supabase-js@2'
import { SignJWT, importPKCS8 } from 'npm:jose@5'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface PaymentPayload {
    type: string
    record: {
        id: string
        user_id: string
        sender_name: string
        amount: number
        operation_code: string
    }
}

// Get OAuth2 access token for FCM using Service Account
async function getAccessToken(): Promise<string> {
    const serviceAccountJson = Deno.env.get('FIREBASE_SERVICE_ACCOUNT')
    if (!serviceAccountJson) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT not configured')
    }

    const serviceAccount = JSON.parse(serviceAccountJson)

    // Create JWT for Google OAuth2
    const now = Math.floor(Date.now() / 1000)
    const jwt = await new SignJWT({
        iss: serviceAccount.client_email,
        sub: serviceAccount.client_email,
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
        scope: 'https://www.googleapis.com/auth/firebase.messaging'
    })
        .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
        .sign(await importPKCS8(serviceAccount.private_key, 'RS256'))

    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt
        })
    })

    const tokenData = await tokenResponse.json()
    if (!tokenData.access_token) {
        throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`)
    }

    return tokenData.access_token
}

Deno.serve(async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
        }
        if (req.headers.get('Authorization') !== `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
        }

        const payload: PaymentPayload = await req.json()
        const payment = payload.record
        if (!payment?.id || !payment.user_id || typeof payment.amount !== 'number') {
            return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })
        }

        // Create Supabase client with service role to bypass RLS
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

        // Get all collaborators (viewers) for this user with FCM tokens
        const { data: collaborators, error } = await supabase
            .from('devices')
            .select('fcm_token, device_name')
            .eq('user_id', payment.user_id)
            .eq('role', 'viewer')
            .eq('is_active', true)
            .not('fcm_token', 'is', null)

        if (error) {
            console.error('Error getting collaborators:', error)
            return new Response(JSON.stringify({ error: error.message }), { status: 500 })
        }

        if (!collaborators || collaborators.length === 0) {
            return new Response(JSON.stringify({ message: 'No collaborators with FCM tokens' }), { status: 200 })
        }

        // Get access token for FCM
        const accessToken = await getAccessToken()
        const serviceAccount = JSON.parse(Deno.env.get('FIREBASE_SERVICE_ACCOUNT')!)
        const projectId = serviceAccount.project_id

        // Send push notification to each collaborator
        let sent = 0
        for (const collab of collaborators) {
            if (!collab.fcm_token) continue

            const fcmPayload = {
                message: {
                    token: collab.fcm_token,
                    notification: {
                        title: `💰 Nuevo pago - S/ ${payment.amount}`,
                        body: `De: ${payment.sender_name}`
                    },
                    data: {
                        sender_name: payment.sender_name || '',
                        amount: String(payment.amount || 0),
                        operation_code: payment.operation_code || '',
                        type: 'payment'
                    },
                    android: {
                        priority: 'high',
                        notification: {
                            sound: 'default',
                            channel_id: 'pagoping_payments'
                        }
                    }
                }
            }

            const fcmResponse = await fetch(
                `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(fcmPayload)
                }
            )

            if (fcmResponse.ok) sent += 1
            else console.error('FCM rejected a notification', fcmResponse.status)
        }

        return new Response(JSON.stringify({
            success: true,
            sent_to: sent
        }), { status: 200 })

    } catch (err: unknown) {
        console.error('Payment notification failed')
        const message = err instanceof Error ? err.message : 'Internal error'
        return new Response(JSON.stringify({ error: message }), { status: 500 })
    }
})
