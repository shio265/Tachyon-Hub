"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RiCloseLine } from "@remixicon/react"
import Image from "next/image"
import { Reward, RewardOption } from "@/lib/types"

interface CreateCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  disabled?: boolean
}

export function CreateCodeDialog({ open, onOpenChange, onSuccess, disabled = false }: CreateCodeDialogProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [availableRewards, setAvailableRewards] = useState<RewardOption[]>([])
  const [loadingRewards, setLoadingRewards] = useState(true)

  const [code, setCode] = useState("")
  const [version, setVersion] = useState<"global" | "cn" | "mobile">("global")
  const [expiredAt, setExpiredAt] = useState("")
  const [selectedRewards, setSelectedRewards] = useState<Reward[]>([])

  // Fetch available rewards
  useEffect(() => {
    if (open) {
      fetchRewards()
    }
  }, [open])

  const fetchRewards = async () => {
    try {
      setLoadingRewards(true)
      const response = await fetch("/api/rewards")
      
      if (!response.ok) {
        throw new Error("Failed to fetch rewards")
      }

      const data = await response.json()
      setAvailableRewards(data.data || [])
    } catch (err: unknown) {
      console.error("Error fetching rewards:", err)
      setError(err instanceof Error ? err.message : "Failed to load rewards")
    } finally {
      setLoadingRewards(false)
    }
  }

  const addReward = (rewardId: string) => {
    const reward = availableRewards.find((r) => r.id === rewardId)
    if (reward && !selectedRewards.find((r) => r.reward_id === rewardId)) {
      setSelectedRewards([...selectedRewards, { 
        reward_id: reward.id,
        name: reward.name,
        icon: reward.icon,
        amount: 1 
      }])
    }
  }

  const removeReward = (rewardId: string) => {
    setSelectedRewards(selectedRewards.filter((r) => r.reward_id !== rewardId))
  }

  const updateRewardAmount = (rewardId: string, amount: number) => {
    setSelectedRewards(
      selectedRewards.map((r) =>
        r.reward_id === rewardId ? { ...r, amount: Math.max(1, amount) } : r
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (disabled) {
      setError("Your account is suspended or banned")
      return
    }

    if (!code.trim()) {
      setError("Code is required")
      return
    }

    if (!session?.user?.id) {
      setError("You must be logged in")
      return
    }

    setLoading(true)

    try {
      // Create code
      const response = await fetch("/api/codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code.trim(),
          version,
          expired_at: expiredAt || undefined,
          rewards: selectedRewards,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create code")
      }

      // Reset form
      setCode("")
      setVersion("global")
      setExpiredAt("")
      setSelectedRewards([])
      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const rewardOptions = availableRewards.filter(
    (r) => !selectedRewards.find((sr) => sr.reward_id === r.id)
  ).map((r) => ({
    value: r.id,
    label: r.name,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Redeem Code</DialogTitle>
          <DialogDescription>
            Add a new redeem code with optional rewards and expiration date
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-none text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="STRINOVA2026"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="version">Version *</Label>
            <Select value={version} onValueChange={(value: "global" | "cn" | "mobile") => setVersion(value)}>
              <SelectTrigger id="version" className="w-full">
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="cn">CN</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expired_at">Expiration Date (Optional)</Label>
            <Input
              id="expired_at"
              type="date"
              value={expiredAt}
              onChange={(e) => setExpiredAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for codes that never expire
            </p>
          </div>

          <div className="space-y-3">
            <Label>Rewards (Optional)</Label>
            
            {selectedRewards.length > 0 && (
              <div className="space-y-2">
                {selectedRewards.map((reward) => (
                  <div
                    key={reward.reward_id}
                    className="flex items-center gap-3 p-3 border bg-muted/30"
                  >
                    <div className="relative w-8 h-8 shrink-0 bg-muted flex items-center justify-center">
                      {reward.icon ? (
                        <Image
                          src={reward.icon}
                          alt={reward.name}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">?</span>
                      )}
                    </div>
                    <span className="flex-1 font-medium">{reward.name}</span>
                    <Input
                      type="number"
                      min="1"
                      value={reward.amount}
                      onChange={(e) =>
                        updateRewardAmount(reward.reward_id, parseInt(e.target.value) || 1)
                      }
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeReward(reward.reward_id)}
                    >
                      <RiCloseLine className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {rewardOptions.length > 0 && !loadingRewards && (
              <Select onValueChange={(value: string) => addReward(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select reward to add..." />
                </SelectTrigger>
                <SelectContent>
                  {rewardOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {loadingRewards && (
              <p className="text-sm text-muted-foreground">Loading rewards...</p>
            )}

            {!loadingRewards && availableRewards.length === 0 && (
              <p className="text-sm text-muted-foreground">No rewards available</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Code"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
