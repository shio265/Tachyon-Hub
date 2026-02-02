export type Reward = {
  reward_id: string
  name: string
  icon: string
  amount: number
}

export type RewardOption = {
  id: string
  name: string
  icon: string
}

export type RedeemCode = {
  id: string
  uploader_id: string
  uploader_name?: string
  uploader_discord_uid?: string
  code: string
  version?: "global" | "cn" | "mobile"
  expired_at: string | null
  created_at: string
  rewards: Reward[]
  status?: "active" | "expired"
}

export type Status = "active" | "expired" | "all"

export type CreateCodeFormData = {
  code: string
  expired_at?: string
  rewards: Reward[]
}
