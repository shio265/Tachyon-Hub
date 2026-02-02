"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RiCloseLine } from "@remixicon/react"
import Image from "next/image"
import { Reward, RewardOption, RedeemCode } from "@/lib/types"
import { toast } from "sonner"

interface EditCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  code: RedeemCode | null
}

export function EditCodeDialog({ open, onOpenChange, onSuccess, code }: EditCodeDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [availableRewards, setAvailableRewards] = useState<RewardOption[]>([])
  const [loadingRewards, setLoadingRewards] = useState(true)

  const [codeValue, setCodeValue] = useState("")
  const [expiredAt, setExpiredAt] = useState("")
  const [selectedRewards, setSelectedRewards] = useState<Reward[]>([])

  // Populate form when code changes
  useEffect(() => {
    if (code && open) {
      setCodeValue(code.code)
      setExpiredAt(code.expired_at ? new Date(code.expired_at).toISOString().split('T')[0] : "")
      setSelectedRewards(code.rewards || [])
    }
  }, [code, open])

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

    if (!codeValue.trim()) {
      setError("Code is required")
      return
    }

    if (!code?.id) {
      setError("Invalid code ID")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/codes/${code.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: codeValue.trim(),
          expired_at: expiredAt || null,
          rewards: selectedRewards,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update code")
      }

      toast.success("Code updated successfully")
      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast.error(errorMessage)
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
          <DialogTitle>Edit Redeem Code</DialogTitle>
          <DialogDescription>
            Update the redeem code details, rewards, and expiration date
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-none text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Code Input */}
            <div className="space-y-2">
              <Label htmlFor="code">Redeem Code *</Label>
              <Input
                id="code"
                placeholder="Enter code"
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Expiration Date */}
            <div className="space-y-2">
              <Label htmlFor="expiredAt">Expiration Date (Optional)</Label>
              <Input
                id="expiredAt"
                type="date"
                value={expiredAt}
                onChange={(e) => setExpiredAt(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for no expiration
              </p>
            </div>

            {/* Rewards Section */}
            <div className="space-y-2">
              <Label>Rewards (Optional)</Label>
              
              {/* Selected Rewards */}
              {selectedRewards.length > 0 && (
                <div className="space-y-2 mb-4">
                  {selectedRewards.map((reward) => (
                    <div key={reward.reward_id} className="flex items-center gap-3 p-3 border rounded-none">
                      <div className="relative w-10 h-10 shrink-0">
                        {reward.icon && (
                          <Image
                            src={reward.icon}
                            alt={reward.name}
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{reward.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`amount-${reward.reward_id}`} className="text-sm">
                          Amount:
                        </Label>
                        <Input
                          id={`amount-${reward.reward_id}`}
                          type="number"
                          min="1"
                          value={reward.amount}
                          onChange={(e) =>
                            updateRewardAmount(reward.reward_id, parseInt(e.target.value) || 1)
                          }
                          className="w-20"
                          disabled={loading}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeReward(reward.reward_id)}
                        disabled={loading}
                      >
                        <RiCloseLine className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Reward */}
              {rewardOptions.length > 0 && (
                <Select
                  onValueChange={addReward}
                  disabled={loading || loadingRewards}
                  value=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingRewards ? "Loading rewards..." : "Add a reward"} />
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
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Code"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
