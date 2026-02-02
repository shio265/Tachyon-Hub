"use client"

import { useState, useMemo } from "react"
import { RedeemCode } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
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
import { RiAddLine, RiSearchLine, RiArrowUpDownLine, RiArrowUpLine, RiArrowDownLine, RiFileCopyLine, RiEditLine, RiDeleteBinLine } from "@remixicon/react"
import Image from "next/image"
import { toast } from "sonner"

type SortField = "status" | "created_at" | "expired_at"
type SortOrder = "asc" | "desc"

interface CodesTableProps {
  codes: RedeemCode[]
  onCreateNew?: () => void
  onEdit?: (code: RedeemCode) => void
  onDelete?: (code: RedeemCode) => void
  showUploader?: boolean
  userType?: "default" | "manager" | "admin"
  currentUserId?: string
  isSuspended?: boolean
  version?: "global" | "cn" | "mobile"
  onVersionChange?: (version: "global" | "cn" | "mobile") => void
}

export function CodesTable({ codes, onCreateNew, onEdit, onDelete, showUploader = false, userType = "default", currentUserId, isSuspended = false, version = "global", onVersionChange }: CodesTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired">("all")
  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [codeToDelete, setCodeToDelete] = useState<RedeemCode | null>(null)

  const filteredAndSortedCodes = useMemo(() => {
    let filtered = codes

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((code) =>
        code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.rewards.some(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (code.uploader_name && code.uploader_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (code.uploader_discord_uid && code.uploader_discord_uid.includes(searchQuery))
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((code) => {
        const isExpired = code.expired_at ? new Date(code.expired_at) < new Date() : false
        return statusFilter === "active" ? !isExpired : isExpired
      })
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number | boolean | null
      let bValue: string | number | boolean | null

      if (sortField === "status") {
        const aExpired = a.expired_at ? new Date(a.expired_at) < new Date() : false
        const bExpired = b.expired_at ? new Date(b.expired_at) < new Date() : false
        aValue = aExpired ? 1 : 0
        bValue = bExpired ? 1 : 0
      } else if (sortField === "created_at" || sortField === "expired_at") {
        aValue = a[sortField] ? new Date(a[sortField]!).getTime() : 0
        bValue = b[sortField] ? new Date(b[sortField]!).getTime() : 0
      } else {
        aValue = a[sortField]
        bValue = b[sortField]
      }

      // Handle null values
      if (aValue === null) aValue = 0
      if (bValue === null) bValue = 0

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [codes, searchQuery, statusFilter, sortField, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCodes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCodes = filteredAndSortedCodes.slice(startIndex, endIndex)

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <RiArrowUpDownLine className="h-4 w-4" />
    }
    return sortOrder === "asc" ? (
      <RiArrowUpLine className="h-4 w-4" />
    ) : (
      <RiArrowDownLine className="h-4 w-4" />
    )
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Code copied to clipboard")
  }

  const canEditCode = (code: RedeemCode) => {
    // manager and admin can edit all codes
    if (userType === "manager" || userType === "admin") {
      return true
    }
    // default users can only edit their own codes
    return currentUserId && code.uploader_id === currentUserId
  }

  const canDeleteCode = (code: RedeemCode) => {
    // manager and admin can delete all codes
    if (userType === "manager" || userType === "admin") {
      return true
    }
    // default users can only delete their own codes
    return currentUserId && code.uploader_id === currentUserId
  }

  const handleDelete = (code: RedeemCode) => {
    setCodeToDelete(code)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (codeToDelete && onDelete) {
      onDelete(codeToDelete)
      setDeleteDialogOpen(false)
      setCodeToDelete(null)
    }
  }

  const getStatusBadge = (code: RedeemCode) => {
    const isExpired = code.expired_at ? new Date(code.expired_at) < new Date() : false
    return isExpired ? (
      <Badge variant="destructive" className="px-2 py-1">Expired</Badge>
    ) : (
      <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20 px-2 py-1">Active</Badge>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-50">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by code, reward, uploader name or Discord ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value: "all" | "active" | "expired") => {
          setStatusFilter(value)
          setCurrentPage(1)
        }}>
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        {onVersionChange && (
          <Select value={version} onValueChange={(value: "global" | "cn" | "mobile") => {
            onVersionChange(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="Version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="cn">CN</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
        )}

        {onCreateNew && (
          <Button onClick={onCreateNew} disabled={isSuspended} title={isSuspended ? "Your account is suspended" : ""}>
            <RiAddLine className="w-4 h-4 mr-2" />
            New Code
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <span>Status</span>
                  <button
                    onClick={() => toggleSort("status")}
                    className={`hover:text-foreground transition-colors ${
                      sortField === "status" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {getSortIcon("status")}
                  </button>
                </div>
              </TableHead>
              <TableHead>Rewards</TableHead>
              {showUploader && <TableHead>Uploader</TableHead>}
              <TableHead className="w-32">
                <div className="flex items-center gap-2">
                  <span>Created</span>
                  <button
                    onClick={() => toggleSort("created_at")}
                    className={`hover:text-foreground transition-colors ${
                      sortField === "created_at" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {getSortIcon("created_at")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="w-32">
                <div className="flex items-center gap-2">
                  <span>Expires</span>
                  <button
                    onClick={() => toggleSort("expired_at")}
                    className={`hover:text-foreground transition-colors ${
                      sortField === "expired_at" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {getSortIcon("expired_at")}
                  </button>
                </div>
              </TableHead>
              {(onEdit || onDelete) && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showUploader ? ((onEdit || onDelete) ? 8 : 7) : ((onEdit || onDelete) ? 7 : 6)} className="text-center text-muted-foreground py-8">
                  No codes found
                </TableCell>
              </TableRow>
            ) : (
              paginatedCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{code.code}</span>
                      <button
                        onClick={() => copyCode(code.code)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy code"
                      >
                        <RiFileCopyLine className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize px-2 py-1">
                      {code.version || "global"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(code)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {code.rewards.length === 0 ? (
                        <span className="text-sm text-muted-foreground">Unknown</span>
                      ) : (
                        code.rewards.map((reward, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-muted px-2 py-1 text-sm">
                            <div className="relative w-5 h-5">
                              <Image
                                src={reward.icon}
                                alt={reward.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span>{reward.amount}x {reward.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </TableCell>
                  {showUploader && (
                    <TableCell className="text-sm">
                      {code.uploader_discord_uid ? (
                        <a
                          href={`https://discord.com/users/${code.uploader_discord_uid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {code.uploader_name || `User ${code.uploader_id.slice(0, 8)}...`}
                        </a>
                      ) : (
                        <span>{code.uploader_name || `User ${code.uploader_id.slice(0, 8)}...`}</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-sm text-muted-foreground w-32">
                    {formatDate(code.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground w-32">
                    {formatDate(code.expired_at)}
                  </TableCell>
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {onEdit && canEditCode(code) && (
                          <button
                            onClick={() => onEdit(code)}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                            title="Edit code"
                          >
                            <RiEditLine className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && canDeleteCode(code) && (
                          <button
                            onClick={() => handleDelete(code)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            title="Delete code"
                          >
                            <RiDeleteBinLine className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and results */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedCodes.length)} of {filteredAndSortedCodes.length} codes
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Items per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    )
                  }
                  return null
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Code</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete code &ldquo;{codeToDelete?.code}&rdquo;? This action cannot be undone.
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
    </div>
  )
}
