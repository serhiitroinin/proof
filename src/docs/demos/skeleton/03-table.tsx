import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonTable() {
  return (
    <div className="w-full overflow-hidden rounded-xl border bg-card">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b bg-muted px-4 py-3">
        <Skeleton className="h-2 w-16" />
        <Skeleton className="h-2 w-12" />
        <Skeleton className="h-2 w-12" />
        <Skeleton className="h-2 w-10" />
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 border-b px-4 py-3 last:border-b-0">
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
          <Skeleton className="h-5 w-14 rounded-sm" />
          <Skeleton className="h-3 w-10" />
        </div>
      ))}
    </div>
  )
}
