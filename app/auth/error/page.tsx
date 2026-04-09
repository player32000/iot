import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Error de autenticacion</CardTitle>
          <CardDescription>
            Ha ocurrido un error durante el proceso de autenticacion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Por favor intenta nuevamente o contacta al administrador si el problema persiste.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/login">
              Volver al inicio de sesion
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
