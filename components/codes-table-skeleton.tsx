import { Skeleton } from "@/components/ui/skeleton"

export function CodesTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filters skeleton */}
      <div className="flex items-center gap-4 flex-wrap">
        <Skeleton className="h-10 flex-1 min-w-50" />
        <Skeleton className="h-10 w-37.5" />
        <Skeleton className="h-10 w-30" />
      </div>

      {/* Table skeleton */}
      <div className="border rounded-none">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex gap-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-28" />
          </div>
          
          {/* Rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-28" />
              <Skeleton className="h-12 w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* Count skeleton */}
      <Skeleton className="h-4 w-40" />
    </div>
  )
}
