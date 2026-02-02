"use client"

import { SessionProvider, useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

function StatusChecker({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [statusAlert, setStatusAlert] = useState<{ open: boolean; status: "suspended" | "banned" | null }>({ open: false, status: null })
  const [checkedOnce, setCheckedOnce] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && !checkedOnce && session?.user?.id) {
      const checkUserStatus = async () => {
        try {
          const response = await fetch(`/api/uploaders/discord/${session.user.id}`)
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data) {
              const userStatus = data.data.status
              
              if (userStatus === "suspended" || userStatus === "banned") {
                setStatusAlert({ open: true, status: userStatus })
              }
            }
          }
          setCheckedOnce(true)
        } catch (err) {
          console.error("Failed to check user status:", err)
          setCheckedOnce(true)
        }
      }

      void checkUserStatus()
    }
  }, [status, checkedOnce, session?.user?.id])

  const handleBannedAccount = async () => {
    try {
      // Delete API key
      if (session?.user?.id) {
        await fetch(`/api/admin/keys/discord/${session.user.id}`, {
          method: 'DELETE',
        })
      }
      
      // Sign out
      await signOut({ callbackUrl: "/" })
    } catch (err) {
      console.error("Failed to handle banned account:", err)
      // Force sign out anyway
      await signOut({ callbackUrl: "/" })
    }
  }

  const handleAlertClose = () => {
    if (statusAlert.status === "banned") {
      handleBannedAccount()
    } else {
      setStatusAlert({ open: false, status: null })
    }
  }

  return (
    <>
      {children}
      <AlertDialog open={statusAlert.open} onOpenChange={(open) => !open && handleAlertClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {statusAlert.status === "banned" ? "Account Banned" : "Account Suspended"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {statusAlert.status === "banned" 
                ? "Your account has been banned. You will be logged out and your API key will be deleted."
                : "Your account has been suspended. You cannot create new codes until your account is reactivated."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => window.open(process.env.NEXT_PUBLIC_DISCORD_SUPPORT_URL || "https://discord.gg/your-server", "_blank")}
            >
              Contact Support
            </Button>
            <AlertDialogAction onClick={handleAlertClose}>
              {statusAlert.status === "banned" ? "Logout" : "I Understand"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StatusChecker>{children}</StatusChecker>
    </SessionProvider>
  )
}
