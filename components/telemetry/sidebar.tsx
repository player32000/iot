"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Radio, Home, Box, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Device, ConnectionStatus } from "@/hooks/use-mqtt"

interface TelemetrySidebarProps {
  devices: Device[]
  activeTab: string
  onTabChange: (tab: string) => void
  isConnected: boolean
  connectionStatus: ConnectionStatus
  userInfo?: ReactNode
}

export function TelemetrySidebar({
  devices,
  activeTab,
  onTabChange,
  isConnected,
  connectionStatus,
  userInfo,
}: TelemetrySidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-sidebar text-sidebar-foreground"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav
        className={cn(
          "fixed md:relative z-40 w-64 h-full bg-sidebar text-sidebar-foreground flex flex-col shadow-lg transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 pb-4 border-b border-sidebar-border">
            <Radio className="h-5 w-5 text-sidebar-primary" />
            <h2 className="text-sm font-semibold tracking-wide">TECSUR TELEMETRIA</h2>
          </div>

          <div className="flex flex-col gap-2 mt-6 flex-1">
            <button
              onClick={() => {
                onTabChange("home")
                setIsOpen(false)
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-colors",
                activeTab === "home"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Home className="h-4 w-4" />
              Inicio
            </button>

            {devices.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-sidebar-foreground/50 uppercase tracking-wider mb-2 px-3">
                  Dispositivos ({devices.length})
                </p>
                {devices.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => {
                      onTabChange(device.id)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-colors",
                      activeTab === device.id
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Box className="h-4 w-4" />
                    <span className="truncate">{device.name}</span>
                  </button>
                ))}
              </div>
            )}

            {devices.length === 0 && (
              <div className="mt-4 px-3 py-4 text-xs text-sidebar-foreground/50 text-center">
                Esperando dispositivos...
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                connectionStatus === "connected" && "bg-green-500",
                connectionStatus === "connecting" && "bg-yellow-500 animate-pulse",
                connectionStatus === "disconnected" && "bg-muted-foreground",
                connectionStatus === "error" && "bg-destructive"
              )}
            />
            <span className="text-sidebar-foreground/60">
              {connectionStatus === "connected" && "Conectado a MQTT"}
              {connectionStatus === "connecting" && "Conectando..."}
              {connectionStatus === "disconnected" && "Desconectado"}
              {connectionStatus === "error" && "Error de conexion"}
            </span>
          </div>
          
          {userInfo && (
            <div className="flex items-center gap-2 pt-2 border-t border-sidebar-border">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-sidebar-foreground/60" />
              </div>
              {userInfo}
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
