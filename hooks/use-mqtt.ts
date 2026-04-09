"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import mqtt, { MqttClient } from "mqtt"

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error"

export interface Device {
  id: string
  name: string
  temperature: number | null
  humidity: number | null
  lastUpdate: string | null
}

const BROKER_URL = "wss://broker.emqx.io:8084/mqtt"

export function useMqtt(userId: string) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting")
  const [devices, setDevices] = useState<Device[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const clientRef = useRef<MqttClient | null>(null)

  const topicRoot = `tecsur/${userId}`

  const handleMessage = useCallback((topic: string, message: Buffer) => {
    try {
      const data = JSON.parse(message.toString())
      const parts = topic.split("/")
      const deviceId = parts[2]

      if (topic.endsWith("anuncio")) {
        setDevices((prev) => {
          const exists = prev.find(d => d.id === deviceId)
          if (exists) return prev
          return [
            ...prev,
            {
              id: deviceId,
              name: data.nombre || deviceId,
              temperature: null,
              humidity: null,
              lastUpdate: null,
            },
          ]
        })
      }

      if (topic.endsWith("telemetria")) {
        setDevices((prev) => {
          const deviceIndex = prev.findIndex(d => d.id === deviceId)
          if (deviceIndex === -1) {
            // Device not announced yet, add it
            return [
              ...prev,
              {
                id: deviceId,
                name: deviceId,
                temperature: data.temp ?? null,
                humidity: data.hum ?? null,
                lastUpdate: new Date().toISOString(),
              },
            ]
          }
          
          const updated = [...prev]
          updated[deviceIndex] = {
            ...updated[deviceIndex],
            temperature: data.temp ?? updated[deviceIndex].temperature,
            humidity: data.hum ?? updated[deviceIndex].humidity,
            lastUpdate: new Date().toISOString(),
          }
          return updated
        })
      }
    } catch (error) {
      console.error("Error parsing MQTT message:", error)
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    const client = mqtt.connect(BROKER_URL, {
      clientId: `tecsur_web_${userId}_${Math.random().toString(16).slice(2, 8)}`,
      clean: true,
      reconnectPeriod: 5000,
    })

    clientRef.current = client

    client.on("connect", () => {
      setConnectionStatus("connected")
      setIsConnected(true)
      client.subscribe(`${topicRoot}/+/anuncio`)
      client.subscribe(`${topicRoot}/+/telemetria`)
    })

    client.on("message", handleMessage)

    client.on("error", () => {
      setConnectionStatus("error")
      setIsConnected(false)
    })

    client.on("close", () => {
      setConnectionStatus("disconnected")
      setIsConnected(false)
    })

    client.on("reconnect", () => {
      setConnectionStatus("connecting")
    })

    return () => {
      if (clientRef.current) {
        clientRef.current.end()
        clientRef.current = null
      }
    }
  }, [userId, topicRoot, handleMessage])

  return {
    connectionStatus,
    isConnected,
    devices,
  }
}
