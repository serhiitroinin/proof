import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

function Empty({ className, variant = "default", ...props }: React.ComponentProps<"div"> & { variant?: "default" | "plain" }) {
  return (
    <div
      data-slot="empty"
      data-variant={variant}
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl p-8 text-center text-balance",
        variant === "default" && "border border-dashed border-border-strong",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-header" className={cn("flex max-w-sm flex-col items-center gap-1", className)} {...props} />
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent text-muted-foreground",
        icon: "size-10 rounded-lg bg-fill text-muted-foreground [&_svg:not([class*='size-'])]:size-5",
        halftone:
          "relative size-24 text-foreground [&_svg:not([class*='size-'])]:size-8 [&_svg]:relative [&_svg]:animate-rise before:absolute before:inset-0 before:bg-[radial-gradient(circle,var(--border-heavy)_1px,transparent_1.5px)] before:bg-[length:8px_8px] before:bg-center before:[mask-image:radial-gradient(circle,var(--foreground)_25%,transparent_70%)] after:absolute after:top-[calc(50%-22px)] after:left-[calc(50%+18px)] after:size-2.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-tool after:animate-[pop_352ms_var(--ease-pop)_264ms_both]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-title" className={cn("font-heading text-sm font-medium", className)} {...props} />
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-sm/5 text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn("flex w-full max-w-sm min-w-0 flex-col items-center gap-2 text-sm text-balance", className)}
      {...props}
    />
  )
}

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia }
