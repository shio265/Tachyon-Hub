"use client"

import { useState } from "react"
import { RewardOption } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RiAddLine, RiDeleteBinLine, RiEditLine } from "@remixicon/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image"

interface RewardsTableProps {
  rewards: RewardOption[]
  onCreateNew: () => void
  onEdit: (reward: RewardOption) => void
  onDelete: (reward: RewardOption) => void
  loading?: boolean
}

export function RewardsTable({ rewards, onCreateNew, onEdit, onDelete, loading }: RewardsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [rewardToDelete, setRewardToDelete] = useState<RewardOption | null>(null)

  const handleDeleteClick = (reward: RewardOption) => {
    setRewardToDelete(reward)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (rewardToDelete) {
      onDelete(rewardToDelete)
      setDeleteDialogOpen(false)
      setRewardToDelete(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Rewards</CardTitle>
            <CardDescription>
              Total rewards: {rewards.length}
            </CardDescription>
            <CardDescription>
              <span className="font-semibold text-destructive">Note:</span> Any redeem codes using this reward will still display the cached name and icon, but the reward itself will be permanently removed from the system.
            </CardDescription>
          </div>
          <Button onClick={onCreateNew}>
            <RiAddLine className="h-4 w-4 mr-2" />
            New Reward
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading rewards...
            </div>
          ) : (
            <div className="border rounded-none">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No rewards found. Create your first reward to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rewards.map((reward) => (
                      <TableRow key={reward.id}>
                        <TableCell>
                          <div className="relative h-10 w-10 border rounded flex items-center justify-center bg-muted">
                            {reward.icon ? (
                              <Image
                                src={reward.icon}
                                alt={reward.name}
                                fill
                                className="object-contain"
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground"></span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{reward.name}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {reward.id}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onEdit(reward)}
                              className="text-muted-foreground hover:text-foreground transition-colors p-1"
                              title="Edit reward"
                            >
                              <RiEditLine className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(reward)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              title="Delete reward"
                            >
                              <RiDeleteBinLine className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}  <br />
              <br />
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reward</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{rewardToDelete?.name}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
