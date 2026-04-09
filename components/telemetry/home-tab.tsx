import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, WifiOff, Loader2, Cpu, Thermometer, Droplets } from "lucide-react"
import type { Device, ConnectionStatus } from "@/hooks/use-mqtt"

interface HomeTabProps {
  devices: Device[]
  isConnected: boolean
  connectionStatus: ConnectionStatus
  userId: string
}

export function HomeTab({ devices, isConnected, connectionStatus, userId }: HomeTabProps) {
  const statusIcon = {
    connected: <Wifi className="h-5 w-5 text-green-500" />,
    connecting: <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />,
    disconnected: <WifiOff className="h-5 w-5 text-muted-foreground" />,
    error: <WifiOff className="h-5 w-5 text-destructive" />,
  }

  const statusText = {
    connected: "Conectado - Escuchando dispositivos",
    connecting: "Conectando al broker MQTT...",
    disconnected: "Desconectado",
    error: "Error de conexion",
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel de Telemetria</h1>
        <p className="text-muted-foreground mt-1">
          Monitoreo en tiempo real de tus dispositivos IoT
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estado</CardTitle>
            {statusIcon[connectionStatus]}
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{statusText[connectionStatus]}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dispositivos</CardTitle>
            <Cpu className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{devices.length}</p>
            <p className="text-sm text-muted-foreground">
              {devices.length === 0 ? "Esperando..." : "conectados"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Topic MQTT</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm bg-muted px-2 py-1 rounded">tecsur/{userId}/+/*</code>
          </CardContent>
        </Card>
      </div>

      {devices.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Resumen de Dispositivos</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <Card key={device.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{device.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">ID: {device.id}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <span>Temperatura</span>
                    </div>
                    <span className="font-mono font-medium">
                      {device.temperature !== null ? `${device.temperature}°C` : "--"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>Humedad</span>
                    </div>
                    <span className="font-mono font-medium">
                      {device.humidity !== null ? `${device.humidity}%` : "--"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {devices.length === 0 && isConnected && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <Cpu className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-foreground mb-1">Esperando dispositivos</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Publica datos desde tu ESP32 en Wokwi al topic{" "}
              <code className="bg-muted px-1 rounded">tecsur/{userId}/tu_dispositivo/anuncio</code>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
