"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RiToolsLine, RiDiscordLine, RiBarChartBoxLine } from "@remixicon/react"

export function MaintenanceDialog() {
  const [open, setOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const pathname = usePathname()

  // Skip maintenance check for legal pages
  const isExemptPage = pathname === "/privacy-policy" || pathname === "/terms-of-service"

  useEffect(() => {
    // Don't check API health on exempt pages
    if (isExemptPage) {
      setIsChecking(false)
      return
    }

    const checkApiHealth = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        const response = await fetch("/api/health", {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          setOpen(true)
        }
      } catch (error) {
        console.error("API health check failed:", error)
        setOpen(true)
      } finally {
        setIsChecking(false)
      }
    }

    checkApiHealth()

    // Recheck every 30 seconds
    const interval = setInterval(checkApiHealth, 30000)

    return () => clearInterval(interval)
  }, [isExemptPage])

  if (isChecking) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-none bg-orange-500/10">
              <RiToolsLine className="h-6 w-6 text-orange-500" />
            </div>
            <DialogTitle className="text-xl">Maintenance Mode</DialogTitle>
          </div>
        </DialogHeader>
        <div className="text-muted-foreground text-base space-y-3 pt-2">
          <div>The API server is currently unavailable. This could be due to:</div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Scheduled maintenance</li>
            <li>Network connectivity issues</li>
            <li>Server is temporarily down</li>
          </ul>
          <div className="text-sm text-muted-foreground">
            We&apos;re working to restore service as quickly as possible. Please try again later.
          </div>
          <div className="text-sm text-muted-foreground">
            If this is an error, you can report it to the support server below.
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1" asChild>
            <a href="https://dsc.gg/tachyon-hub" target="_blank" rel="noopener noreferrer">
              <RiDiscordLine className="h-4 w-4 mr-2" />
              Support
            </a>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <a href="https://status.shiori.studio" target="_blank" rel="noopener noreferrer">
              <RiBarChartBoxLine className="h-4 w-4 mr-2" />
              Status Page
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
