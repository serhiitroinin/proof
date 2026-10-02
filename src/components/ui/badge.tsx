import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border border-transparent px-2 text-xs font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&>svg]:pointer-events-none [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-fill text-muted-foreground [a]:hover:bg-fill-hover [a]:hover:text-foreground",
        primary: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        secondary: "bg-muted text-foreground [a]:hover:bg-fill-hover",
        tool: "bg-tool-subtle text-tool-text [a]:hover:border-tool-border",
        outline: "border-border-strong text-foreground [a]:hover:bg-fill",
        ghost: "text-muted-foreground [a]:hover:bg-fill [a]:hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        info: "bg-info-subtle text-info",
        success: "bg-success-subtle text-success",
        warning: "bg-warning-subtle text-warning",
        destructive: "bg-destructive-subtle text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  dot = false,
  children,
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { dot?: boolean }) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
        children: (
          <>
            {dot && <span data-slot="badge-dot" aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />}
            {children}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
