import { cn } from "cn"

// Size and radius come from the caller, so the shape matches the content it stands in for.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "rounded-md bg-skeleton bg-[linear-gradient(90deg,var(--skeleton)_0_30%,var(--skeleton-highlight)_50%,var(--skeleton)_70%_100%)] bg-[length:300%_100%] animate-[shimmer_1540ms_ease-in-out_infinite]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
