import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonText() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}
