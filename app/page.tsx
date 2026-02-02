"use client"

import { useState, useEffect } from "react"
import { CodesTable } from "@/components/codes-table"
import { CodesTableSkeleton } from "@/components/codes-table-skeleton"
import { RedeemCode } from "@/lib/types"

export default function Page() {
  const [codes, setCodes] = useState<RedeemCode[]>([])
  const [loading, setLoading] = useState(true)
  const [version, setVersion] = useState<"global" | "cn" | "mobile">("global")

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        setLoading(true)

        const response = await fetch(`/api/codes?version=${version}`)

        if (!response.ok) {
          return
        }

        const data = await response.json()
        setCodes(data.data || [])
        setLoading(false)
      } catch {
        // 
      }
    }

    fetchCodes()
  }, [version])

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Strinova Redeem Codes</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Browse and search available redeem codes for Strinova
          </p>
        </div>

        {loading ? (
          <CodesTableSkeleton />
        ) : (
          <CodesTable 
            codes={codes} 
            showUploader={true}
            version={version}
            onVersionChange={setVersion}
          />
        )}
      </div>
    </div>
  )
}
