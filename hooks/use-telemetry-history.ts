"use client"

import { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

export interface TelemetryDataPoint {
  timestamp: string
  temperature: number
  humidity: number
}

const MAX_DATA_POINTS = 100

export function useTelemetryHistory(userId: string, deviceId: string) {
  const [history, setHistory] = useState<TelemetryDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadFromSupabase = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    try {
      // Get the device record first
      const { data: deviceRecord } = await supabase
        .from("devices")
        .select("id")
        .eq("user_id", userId)
        .eq("device_id", deviceId)
        .single()

      if (!deviceRecord) {
        setHistory([])
        return
      }

      // Load telemetry data
      const { data: telemetry } = await supabase
        .from("telemetry")
        .select("temperature, humidity, created_at")
        .eq("device_id", deviceRecord.id)
        .order("created_at", { ascending: true })
        .limit(MAX_DATA_POINTS)

      if (telemetry) {
        setHistory(
          telemetry.map((t) => ({
            timestamp: t.created_at,
            temperature: t.temperature,
            humidity: t.humidity,
          }))
        )
      }
    } catch (error) {
      console.error("Error loading telemetry:", error)
    } finally {
      setIsLoading(false)
    }
  }, [userId, deviceId])

  const addDataPoint = useCallback((point: TelemetryDataPoint) => {
    setHistory((prev) => {
      const updated = [...prev, point]
      // Keep only the last MAX_DATA_POINTS
      if (updated.length > MAX_DATA_POINTS) {
        return updated.slice(-MAX_DATA_POINTS)
      }
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return {
    history,
    addDataPoint,
    clearHistory,
    loadFromSupabase,
    isLoading,
  }
}
