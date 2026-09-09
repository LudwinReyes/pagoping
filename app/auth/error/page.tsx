import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const params = await searchParams
  const errorMessage = params?.message || params?.error

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-4 sm:p-6 md:p-10 safe-top safe-bottom">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center mb-2">
            <Logo size="md" asLink={false} />
          </div>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Algo salió mal</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {errorMessage ? (
                <p className="text-sm text-muted-foreground mb-4">Error: {errorMessage}</p>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">Ocurrió un error inesperado.</p>
              )}
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/login">Volver al inicio</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
