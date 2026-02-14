// Supabase Edge Function: send-payment-notification
// Uses FCM v1 API with Service Account authentication
//
// Deploy: supabase functions deploy send-payment-notification

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createRemoteJWKSet, jwtVerify, SignJWT } from 'https://deno.land/x/jose@v4.14.4/index.ts'

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
        .sign(await importPrivateKey(serviceAccount.private_key))

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

// Import RSA private key for signing
async function importPrivateKey(pem: string): Promise<CryptoKey> {
    const pemContents = pem
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\n/g, '')

    const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))

    return await crypto.subtle.importKey(
        'pkcs8',
        binaryDer,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    )
}

serve(async (req) => {
    try {
        const payload: PaymentPayload = await req.json()
        const payment = payload.record

        console.log('📩 Nuevo pago recibido:', payment)

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

        console.log(`📱 Colaboradores encontrados: ${collaborators?.length || 0}`)

        if (!collaborators || collaborators.length === 0) {
            return new Response(JSON.stringify({ message: 'No collaborators with FCM tokens' }), { status: 200 })
        }

        // Get access token for FCM
        const accessToken = await getAccessToken()
        const serviceAccount = JSON.parse(Deno.env.get('FIREBASE_SERVICE_ACCOUNT')!)
        const projectId = serviceAccount.project_id

        // Send push notification to each collaborator
        const results = []
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

            const fcmResult = await fcmResponse.json()
            console.log(`📤 FCM Response for ${collab.device_name}:`, fcmResult)
            results.push({ device: collab.device_name, result: fcmResult })
        }

        return new Response(JSON.stringify({
            success: true,
            sent_to: collaborators.length,
            results
        }), { status: 200 })

    } catch (err) {
        console.error('Error:', err)
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
})
