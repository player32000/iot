"use client"

import { useEffect, useCallback } from "react"
import { Device } from "@/hooks/use-mqtt"
import { useTelemetryHistory, TelemetryDataPoint } from "@/hooks/use-telemetry-history"
import { DeviceCard } from "./device-card"
import { SingleSensorChart } from "./telemetry-chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Database } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DeviceTabWithSupabaseProps {
  device: Device
  supabaseUserId: string
}

export function DeviceTabWithSupabase({ device, supabaseUserId }: DeviceTabWithSupabaseProps) {
  const { history, addDataPoint, clearHistory, loadFromSupabase, isLoading } = useTelemetryHistory(
    supabaseUserId,
    device.id
  )

  // Load history from Supabase on mount
  useEffect(() => {
    loadFromSupabase()
  }, [loadFromSupabase])

  // Save new telemetry data to Supabase when device data changes
  const saveTelemetry = useCallback(async () => {
    if (device.temperature === null || device.humidity === null) return
    
    const supabase = createClient()
    
    // Get the device record
    const { data: deviceRecord } = await supabase
      .from("devices")
      .select("id")
      .eq("user_id", supabaseUserId)
      .eq("device_id", device.id)
      .single()

    if (!deviceRecord) return

    // Insert telemetry
    await supabase.from("telemetry").insert({
      device_id: deviceRecord.id,
      temperature: device.temperature,
      humidity: device.humidity,
    })

    // Also update local state
    addDataPoint({
      timestamp: new Date().toISOString(),
      temperature: device.temperature,
      humidity: device.humidity,
    })
  }, [device.temperature, device.humidity, device.id, supabaseUserId, addDataPoint])

  // Track previous values to detect changes
  useEffect(() => {
    if (device.temperature !== null && device.humidity !== null) {
      saveTelemetry()
    }
  }, [device.lastUpdate]) // Only trigger on lastUpdate change

  async function handleClearHistory() {
    const supabase = createClient()
    
    // Get the device record
    const { data: deviceRecord } = await supabase
      .from("devices")
      .select("id")
      .eq("user_id", supabaseUserId)
      .eq("device_id", device.id)
      .single()

    if (deviceRecord) {
      await supabase
        .from("telemetry")
        .delete()
        .eq("device_id", deviceRecord.id)
    }
    
    clearHistory()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{device.name}</h1>
          <p className="text-muted-foreground">ID: {device.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Database className="w-4 h-4" />
            <span>Supabase</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DeviceCard
          title="Temperatura"
          value={device.temperature}
          unit="°C"
          type="temperature"
        />
        <DeviceCard
          title="Humedad"
          value={device.humidity}
          unit="%"
          type="humidity"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Historial de Telemetria</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearHistory}
          disabled={history.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Limpiar historial
        </Button>
      </div>

      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Cargando historial...
        </div>
      ) : history.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-3))]" />
                Temperatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SingleSensorChart
                data={history}
                dataKey="temperature"
                name="Temperatura"
                unit="°C"
                color="hsl(var(--chart-3))"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]" />
                Humedad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SingleSensorChart
                data={history}
                dataKey="humidity"
                name="Humedad"
                unit="%"
                color="hsl(var(--chart-1))"
                domain={[0, 100]}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            No hay datos de telemetria aun. Los datos se guardaran automaticamente cuando lleguen del dispositivo.
          </CardContent>
        </Card>
      )}

      {device.lastUpdate && (
        <p className="text-sm text-muted-foreground text-right">
          Ultima actualizacion: {new Date(device.lastUpdate).toLocaleString("es-ES")}
        </p>
      )}
    </div>
  )
}
