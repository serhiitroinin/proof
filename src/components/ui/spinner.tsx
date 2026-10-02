import * as React from "react"
import { cn } from "cn"
import { Loader2Icon } from "lucide-react"

const BEAT = ["[--d:0]", "[--d:1]", "[--d:2]", "[--d:3]", "[--d:4]", "[--d:5]", "[--d:6]", "[--d:7]", "[--d:8]"]

function Spinner({
  className,
  variant = "circle",
  ...props
}: React.ComponentProps<"svg"> & { variant?: "circle" | "matrix" }) {
  if (variant === "matrix") {
    return (
      <div
        data-slot="spinner"
        data-variant="matrix"
        role="status"
        aria-label="Loading"
        className={cn("grid size-12 shrink-0 grid-cols-5 gap-[8.333%]", className)}
        {...(props as React.ComponentProps<"div">)}
      >
        {Array.from({ length: 25 }, (_, n) => (
          <span
            key={n}
            className={cn(
              "aspect-square rounded-full bg-border-heavy animate-[matrix_924ms_linear_calc(var(--d)*77ms)_infinite]",
              BEAT[(n % 5) + Math.floor(n / 5)]
            )}
          />
        ))}
      </div>
    )
  }
  return (
    <Loader2Icon
      data-slot="spinner"
      data-variant="circle"
      role="status"
      aria-label="Loading"
      className={cn("size-4 shrink-0 animate-spin text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Spinner }
