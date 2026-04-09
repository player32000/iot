import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TelemetryDashboard } from "@/components/telemetry/telemetry-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile to get the display_name for MQTT topics
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single()

  const displayName = profile?.display_name || user.user_metadata?.display_name || user.email?.split("@")[0] || "user"

  return (
    <TelemetryDashboard 
      userId={user.id} 
      displayName={displayName}
      userEmail={user.email || ""}
    />
  )
}
