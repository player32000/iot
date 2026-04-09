"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useMqtt, Device } from "@/hooks/use-mqtt"
import { TelemetrySidebar } from "./sidebar"
import { HomeTab } from "./home-tab"
import { DeviceTabWithSupabase } from "./device-tab-supabase"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface TelemetryDashboardProps {
  userId: string
  displayName: string
  userEmail: string
}

export function TelemetryDashboard({ userId, displayName, userEmail }: TelemetryDashboardProps) {
  const [activeTab, setActiveTab] = useState("home")
  const router = useRouter()
  
  const { devices, isConnected, connectionStatus } = useMqtt(displayName)

  // Register devices in Supabase when they appear
  const registerDevice = useCallback(async (device: Device) => {
    const supabase = createClient()
    
    // Check if device exists
    const { data: existing } = await supabase
      .from("devices")
      .select("id")
      .eq("user_id", userId)
      .eq("device_id", device.id)
      .single()

    if (!existing) {
      await supabase.from("devices").insert({
        user_id: userId,
        device_id: device.id,
        name: device.name,
      })
    }
  }, [userId])

  useEffect(() => {
    devices.forEach(registerDevice)
  }, [devices, registerDevice])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const selectedDevice = devices.find(d => d.id === activeTab)

  return (
    <div className="flex h-screen bg-background">
      <TelemetrySidebar
        devices={devices}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isConnected={isConnected}
        connectionStatus={connectionStatus}
        userInfo={
          <div className="flex items-center justify-between w-full">
            <div className="truncate">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{userEmail}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        }
      />
      
      <main className="flex-1 overflow-auto">
        {activeTab === "home" ? (
          <HomeTab
            devices={devices}
            isConnected={isConnected}
            connectionStatus={connectionStatus}
            userId={displayName}
          />
        ) : selectedDevice ? (
          <DeviceTabWithSupabase 
            device={selectedDevice} 
            supabaseUserId={userId}
          />
        ) : null}
      </main>
    </div>
  )
}
