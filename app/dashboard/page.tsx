"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CodesTable } from "@/components/codes-table"
import { CreateCodeDialog } from "@/components/create-code-dialog"
import { EditCodeDialog } from "@/components/edit-code-dialog"
import { RewardsTable } from "@/components/rewards-table"
import { CreateRewardDialog } from "@/components/create-reward-dialog"
import { EditRewardDialog } from "@/components/edit-reward-dialog"
import { RedeemCode, RewardOption } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RiFileCopyLine, RiEyeLine, RiEyeOffLine } from "@remixicon/react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Uploader {
  id: string
  name: string
  discord_uid: string
  type: "default" | "manager" | "admin"
  status: "active" | "suspended" | "banned"
  created_at: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [codes, setCodes] = useState<RedeemCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [version, setVersion] = useState<"global" | "cn" | "mobile">("global")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedCode, setSelectedCode] = useState<RedeemCode | null>(null)
  const [apiKey, setApiKey] = useState<string>("")
  const [apiKeyLoading, setApiKeyLoading] = useState(true)
  const [showApiKey, setShowApiKey] = useState(false)
  const [uploaders, setUploaders] = useState<Uploader[]>([])
  const [uploadersLoading, setUploadersLoading] = useState(true)
  const [userStatus, setUserStatus] = useState<"active" | "suspended" | "banned" | null>(null)
  const [rewards, setRewards] = useState<RewardOption[]>([])
  const [rewardsLoading, setRewardsLoading] = useState(true)
  const [createRewardDialogOpen, setCreateRewardDialogOpen] = useState(false)
  const [editRewardDialogOpen, setEditRewardDialogOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState<RewardOption | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const fetchCodes = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      // Fetch codes
      const response = await fetch(`/api/codes?version=${version}`)

      if (!response.ok) {
        throw new Error("Failed to fetch codes")
      }

      const data = await response.json()
      setCodes(data.data || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load codes")
    } finally {
      setLoading(false)
    }
  }, [version])

  const fetchApiKey = useCallback(async () => {
    try {
      setApiKeyLoading(true)
      const response = await fetch(`/api/admin/keys/discord/${session?.user?.id}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data?.key) {
          setApiKey(data.data.key)
        }
      }
    } catch (err) {
      console.error("Failed to fetch API key:", err)
    } finally {
      setApiKeyLoading(false)
    }
  }, [session?.user?.id])

  const fetchUploaders = useCallback(async () => {
    if (session?.user?.type !== "admin" && session?.user?.type !== "manager") {
      return
    }
    
    try {
      setUploadersLoading(true)
      const response = await fetch("/api/uploaders")

      if (!response.ok) {
        throw new Error("Failed to fetch uploaders")
      }

      const data = await response.json()
      setUploaders(data.data || [])
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : "Failed to load uploaders")
    } finally {
      setUploadersLoading(false)
    }
  }, [session?.user?.type])

  const fetchRewards = useCallback(async () => {
    if (session?.user?.type !== "admin" && session?.user?.type !== "manager") {
      return
    }
    
    try {
      setRewardsLoading(true)
      const response = await fetch("/api/rewards")

      if (!response.ok) {
        throw new Error("Failed to fetch rewards")
      }

      const data = await response.json()
      setRewards(data.data || [])
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : "Failed to load rewards")
    } finally {
      setRewardsLoading(false)
    }
  }, [session?.user?.type])

  const checkUserStatus = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/uploaders/discord/${session.user.id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setUserStatus(data.data.status)
        }
      }
    } catch (err) {
      console.error("Failed to check user status:", err)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (session?.user?.id) {
      fetchCodes()
      fetchApiKey()
      if (session?.user?.type === "admin" || session?.user?.type === "manager") {
        fetchUploaders()
        fetchRewards()
      }
      
      // Check user status for suspended state
      checkUserStatus()
    }
  }, [session, fetchCodes, fetchApiKey, fetchUploaders, fetchRewards, checkUserStatus])

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
    }
  }

  const createApiKey = async () => {
    try {
      setApiKeyLoading(true)
      const response = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: session?.user?.name || 'User API Key',
          description: 'API key for dashboard access',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data?.key) {
          setApiKey(data.data.key)
          setShowApiKey(true)
        }
      }
    } catch (err) {
      console.error('Failed to create API key:', err)
    } finally {
      setApiKeyLoading(false)
    }
  }

  const handleEdit = (code: RedeemCode) => {
    setSelectedCode(code)
    setEditDialogOpen(true)
  }

  const handleDelete = async (code: RedeemCode) => {
    try {
      const response = await fetch(`/api/codes/${code.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete code')
      }

      toast.success('Code deleted successfully')
      fetchCodes()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete code'
      toast.error(errorMessage)
    }
  }

  const handleStatusChange = async (uploaderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/uploaders/${uploaderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status")
      }

      toast.success("Uploader status updated successfully")
      fetchUploaders()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update status"
      toast.error(errorMessage)
    }
  }

  const handleEditReward = (reward: RewardOption) => {
    setSelectedReward(reward)
    setEditRewardDialogOpen(true)
  }

  const handleDeleteReward = async (reward: RewardOption) => {
    try {
      const response = await fetch(`/api/rewards/${reward.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete reward")
      }

      toast.success("Reward deleted successfully")
      fetchRewards()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete reward"
      toast.error(errorMessage)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "suspended":
        return <Badge className="bg-yellow-500">Suspended</Badge>
      case "banned":
        return <Badge variant="destructive">Banned</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "admin":
        return <Badge variant="destructive">Admin</Badge>
      case "manager":
        return <Badge className="bg-blue-500">Manager</Badge>
      case "default":
        return <Badge variant="secondary">Default</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your redeem codes{session?.user?.type === "admin" || session?.user?.type === "manager" ? ", uploaders, and rewards" : ""}
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-none">
            {error}
          </div>
        )}

        {/* Only show tabs for admin/manager, otherwise show normal content */}
        {session?.user?.type === "admin" || session?.user?.type === "manager" ? (
          <Tabs defaultValue="codes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="codes">Codes</TabsTrigger>
              <TabsTrigger value="uploaders">Uploaders</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>
            
            <TabsContent value="codes" className="space-y-6">
              {/* API Key Card */}
              <Card>
                <CardHeader>
                  <CardTitle>API Key</CardTitle>
                  <CardDescription>
                    Use this key to authenticate API requests. You can find the API documentation at{" "}
                    <a
                      href={`${process.env.API_BASE_URL || "http://localhost:4000"}/api-docs`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {process.env.API_BASE_URL || "http://localhost:4000"}/api-docs
                    </a>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {apiKeyLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : apiKey ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 font-mono text-sm bg-muted px-3 py-2 overflow-x-auto">
                        {showApiKey ? apiKey : "••••••••••••••••••••••••••••••••"}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowApiKey(!showApiKey)}
                        title={showApiKey ? "Hide API key" : "Show API key"}
                      >
                        {showApiKey ? <RiEyeOffLine className="h-4 w-4" /> : <RiEyeLine className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyApiKey}
                        title="Copy API key"
                      >
                        <RiFileCopyLine className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">No API key found</p>
                      <Button onClick={createApiKey}>
                        Create API Key
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-96 w-full" />
                </div>
              ) : (
                <CodesTable
                  codes={codes}
                  onCreateNew={() => setCreateDialogOpen(true)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  userType={session?.user?.type}
                  currentUserId={session?.user?.uploaderId}
                  isSuspended={userStatus === "suspended"}
                  version={version}
                  onVersionChange={setVersion}
                />
              )}
            </TabsContent>

            <TabsContent value="uploaders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Uploaders</CardTitle>
                  <CardDescription>
                    Total uploaders: {uploaders.length}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {uploadersLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-96 w-full" />
                    </div>
                  ) : (
                    <div className="border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Discord ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-40">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {uploaders.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                No uploaders found
                              </TableCell>
                            </TableRow>
                          ) : (
                            uploaders.map((uploader) => (
                              <TableRow key={uploader.id}>
                                <TableCell className="font-medium">{uploader.name}</TableCell>
                                <TableCell className="font-mono text-sm">
                                  <a
                                    href={`https://discord.com/users/${uploader.discord_uid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    {uploader.discord_uid}
                                  </a>
                                </TableCell>
                                <TableCell>{getTypeBadge(uploader.type)}</TableCell>
                                <TableCell>{getStatusBadge(uploader.status)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(uploader.created_at)}
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={uploader.status}
                                    onValueChange={(value) => handleStatusChange(uploader.id, value)}
                                    disabled={uploader.id === session?.user?.uploaderId}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="suspended">Suspended</SelectItem>
                                      <SelectItem value="banned">Banned</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <RewardsTable
                rewards={rewards}
                onCreateNew={() => setCreateRewardDialogOpen(true)}
                onEdit={handleEditReward}
                onDelete={handleDeleteReward}
                loading={rewardsLoading}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {/* API Key Card */}
            <Card>
              <CardHeader>
                <CardTitle>API Key</CardTitle>
                <CardDescription>
                  Use this key to authenticate API requests. You can find the API documentation at{" "}
                  <a
                    href={`${process.env.API_BASE_URL || "http://localhost:4000"}/api-docs`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {process.env.API_BASE_URL || "http://localhost:4000"}/api-docs
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {apiKeyLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : apiKey ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 font-mono text-sm bg-muted px-3 py-2 overflow-x-auto">
                      {showApiKey ? apiKey : "••••••••••••••••••••••••••••••••"}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                      title={showApiKey ? "Hide API key" : "Show API key"}
                    >
                      {showApiKey ? <RiEyeOffLine className="h-4 w-4" /> : <RiEyeLine className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyApiKey}
                      title="Copy API key"
                    >
                      <RiFileCopyLine className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">No API key found</p>
                    <Button onClick={createApiKey}>
                      Create API Key
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
            ) : (
              <CodesTable
                codes={codes}
                onCreateNew={() => setCreateDialogOpen(true)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                userType={session?.user?.type}
                currentUserId={session?.user?.uploaderId}
                isSuspended={userStatus === "suspended"}
                version={version}
                onVersionChange={setVersion}
              />
            )}
          </>
        )}
      </div>

      <CreateCodeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchCodes}
        disabled={userStatus === "suspended" || userStatus === "banned"}
      />

      <EditCodeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchCodes}
        code={selectedCode}
      />

      <CreateRewardDialog
        open={createRewardDialogOpen}
        onOpenChange={setCreateRewardDialogOpen}
        onSuccess={fetchRewards}
      />

      <EditRewardDialog
        open={editRewardDialogOpen}
        onOpenChange={setEditRewardDialogOpen}
        onSuccess={fetchRewards}
        reward={selectedReward}
      />
    </div>
  )
}
