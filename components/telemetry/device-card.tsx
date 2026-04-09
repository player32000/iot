import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Thermometer, Droplets } from "lucide-react"

interface DeviceCardProps {
  title: string
  value: number | null
  unit: string
  type: "temperature" | "humidity"
}

export function DeviceCard({ title, value, unit, type }: DeviceCardProps) {
  const Icon = type === "temperature" ? Thermometer : Droplets
  const colorClass = type === "temperature" ? "text-orange-500" : "text-blue-500"
  const borderClass = type === "temperature" ? "border-t-orange-500" : "border-t-blue-500"

  return (
    <Card className={cn("border-t-4 shadow-md", borderClass)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Icon className={cn("h-4 w-4", colorClass)} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-foreground">
          {value !== null ? (
            <>
              {value}
              <span className="text-xl ml-1">{unit}</span>
            </>
          ) : (
            <span className="text-muted-foreground">--</span>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
