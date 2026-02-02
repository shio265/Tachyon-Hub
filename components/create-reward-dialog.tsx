"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { RiUploadLine, RiCloseLine } from "@remixicon/react"
import Image from "next/image"

interface CreateRewardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateRewardDialog({ open, onOpenChange, onSuccess }: CreateRewardDialogProps) {
  const [name, setName] = useState("")
  const [iconUrl, setIconUrl] = useState("")
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file")
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      setIconFile(file)
      setIconUrl("") // Clear URL if file is selected
      setError("")

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setIconPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlChange = (url: string) => {
    setIconUrl(url)
    if (url) {
      setIconFile(null)
      setIconPreview("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const clearFile = () => {
    setIconFile(null)
    setIconPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError("Name is required")
      return
    }

    if (!iconFile && !iconUrl.trim()) {
      setError("Please provide an icon (file upload or URL)")
      return
    }

    try {
      setLoading(true)
      setError("")

      const formData = new FormData()
      formData.append("name", name.trim())

      if (iconFile) {
        formData.append("icon", iconFile)
      } else if (iconUrl) {
        formData.append("iconUrl", iconUrl.trim())
      }

      const response = await fetch("/api/rewards", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create reward")
      }

      toast.success("Reward created successfully")
      setName("")
      setIconUrl("")
      setIconFile(null)
      setIconPreview("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create reward"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !loading) {
      setName("")
      setIconUrl("")
      setIconFile(null)
      setIconPreview("")
      setError("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Reward</DialogTitle>
            <DialogDescription>
              Add a new reward with an icon. You can either upload an image or provide a URL.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-none text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bablo"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              
              {/* File Upload */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="flex-1"
                  >
                    <RiUploadLine className="h-4 w-4 mr-2" />
                    {iconFile ? "Change Image" : "Upload Image"}
                  </Button>
                  {iconFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={clearFile}
                      disabled={loading}
                    >
                      <RiCloseLine className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {iconFile && (
                  <p className="text-sm text-muted-foreground">
                    {iconFile.name} ({(iconFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="iconUrl">Icon URL</Label>
                <Input
                  id="iconUrl"
                  type="url"
                  value={iconUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com/icon.png"
                  disabled={loading || !!iconFile}
                />
              </div>

              {/* Preview */}
              {(iconPreview || iconUrl) && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="relative h-24 w-24 border rounded-none overflow-hidden bg-muted">
                    <Image
                      src={iconPreview || iconUrl}
                      alt="Icon preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Reward"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
