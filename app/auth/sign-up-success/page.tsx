import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl">Verifica tu correo</CardTitle>
          <CardDescription>
            Te hemos enviado un enlace de verificacion a tu correo electronico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Haz clic en el enlace del correo para activar tu cuenta y acceder al panel de telemetria.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">
              Volver al inicio de sesion
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
