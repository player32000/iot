"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { TelemetryDataPoint } from "@/hooks/use-telemetry-history"

interface SingleSensorChartProps {
  data: TelemetryDataPoint[]
  dataKey: "temperature" | "humidity"
  name: string
  unit: string
  color: string
  domain?: [number | "auto", number | "auto"]
}

export function SingleSensorChart({
  data,
  dataKey,
  name,
  unit,
  color,
  domain = ["auto", "auto"]
}: SingleSensorChartProps) {
  const chartData = data.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    [dataKey]: point[dataKey],
  }))

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="time"
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 11 }}
            domain={domain}
            label={{ value: unit, angle: -90, position: 'insideLeft', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, name]}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            name={name}
            stroke={"#3b82f6"}
            strokeWidth={2}
            dot={true}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Keep the combined chart as an option
interface TelemetryChartProps {
  data: TelemetryDataPoint[]
}

export function TelemetryChart({ data }: TelemetryChartProps) {
  return (
    <div className="grid gap-6">
      <SingleSensorChart
        data={data}
        dataKey="temperature"
        name="Temperatura"
        unit="°C"
        color="hsl(var(--chart-3))"
      />
      <SingleSensorChart
        data={data}
        dataKey="humidity"
        name="Humedad"
        unit="%"
        color="hsl(var(--chart-1))"
        domain={[0, 100]}
      />
    </div>
  )
}
