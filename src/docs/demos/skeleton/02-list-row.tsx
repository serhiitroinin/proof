import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonListRow() {
  return (
    <div className="flex w-full max-w-sm flex-col rounded-xl border bg-card">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <Skeleton className="h-5 w-12 rounded-sm" />
        </div>
      ))}
    </div>
  )
}
