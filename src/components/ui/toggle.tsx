import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-2 rounded-md border border-transparent text-sm font-medium whitespace-nowrap text-foreground transition-[color,background-color,border-color,box-shadow,transform] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px active:scale-[0.99] disabled:pointer-events-none disabled:text-faint disabled:shadow-none disabled:bg-none aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive aria-pressed:bg-fill-active aria-pressed:bg-none aria-pressed:shadow-pressed aria-pressed:[&_svg]:text-foreground data-pressed:bg-fill-active data-pressed:bg-none data-pressed:shadow-pressed data-pressed:[&_svg]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5 hover:[&_svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-fill disabled:bg-transparent",
        outline:
          "border-border-strong bg-card shadow-raise sheen hover:border-border-heavy aria-pressed:border-border-strong data-pressed:border-border-strong disabled:border-transparent disabled:bg-fill",
      },
      size: {
        default: "h-8 min-w-8 px-2",
        sm: "h-7 min-w-7 gap-1.5 px-2",
        lg: "h-10 min-w-10 px-3 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
