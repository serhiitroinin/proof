import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// aria-busy keeps the resting look, so a spinner reads as work and not as a disabled control.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px active:scale-[0.99] disabled:pointer-events-none aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:transition-opacity data-progress:relative data-progress:pointer-events-none data-progress:border-transparent! data-progress:bg-transparent! data-progress:bg-none! data-progress:text-transparent! data-progress:shadow-none! data-progress:duration-[264ms] data-progress:[&_svg]:opacity-0!",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-raise-control sheen hover:bg-primary-hover active:bg-none active:bg-primary-hover active:shadow-pressed disabled:border-transparent disabled:bg-fill disabled:bg-none disabled:text-faint disabled:shadow-none disabled:aria-busy:bg-primary disabled:aria-busy:text-primary-foreground disabled:aria-busy:shadow-raise-control [&_svg]:opacity-80",
        outline:
          "border-border-strong bg-card text-foreground shadow-raise sheen hover:border-border-heavy active:bg-none active:shadow-pressed aria-expanded:border-border-heavy aria-expanded:bg-none aria-expanded:shadow-pressed disabled:border-transparent disabled:bg-fill disabled:bg-none disabled:text-faint disabled:shadow-none disabled:aria-busy:border-border-strong disabled:aria-busy:bg-card disabled:aria-busy:text-muted-foreground disabled:aria-busy:shadow-raise [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground aria-expanded:[&_svg]:text-foreground",
        secondary:
          "border-transparent bg-fill text-foreground shadow-raise sheen hover:bg-fill-hover active:bg-none active:bg-fill-active active:shadow-pressed aria-expanded:bg-none aria-expanded:bg-fill-active aria-expanded:shadow-pressed disabled:bg-fill disabled:bg-none disabled:text-faint disabled:shadow-none [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground",
        ghost:
          "border-transparent text-foreground hover:bg-fill active:bg-fill-active aria-expanded:bg-fill disabled:bg-transparent disabled:text-faint [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground aria-expanded:[&_svg]:text-foreground",
        destructive:
          "border-destructive-border bg-card text-destructive shadow-raise hover:border-destructive hover:bg-destructive-subtle active:bg-destructive-subtle active:shadow-pressed focus-visible:ring-destructive disabled:border-transparent disabled:bg-fill disabled:text-faint disabled:shadow-none disabled:aria-busy:border-destructive-border disabled:aria-busy:bg-card disabled:aria-busy:text-destructive disabled:aria-busy:shadow-raise [&_svg]:opacity-80",
        link: "h-auto border-transparent px-0 text-foreground underline-offset-4 hover:underline active:translate-y-0 active:scale-100 active:text-muted-foreground disabled:text-faint",
      },
      size: {
        default: "h-8 gap-2 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1.5 px-2 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-10 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  progress,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** 0..1 collapses the button into the motif progress line; undefined restores it. */
    progress?: number
  }) {
  const busy = progress !== undefined
  const p = busy ? Math.min(1, Math.max(0, progress)) : 0
  return (
    <ButtonPrimitive
      data-slot="button"
      data-progress={busy || undefined}
      aria-busy={busy || undefined}
      disabled={busy || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      {busy && (
        <span
          aria-hidden
          data-slot="button-progress"
          style={{ "--progress": p } as React.CSSProperties}
          className="pointer-events-none absolute inset-x-1.5 inset-y-0 flex animate-rise items-center [animation-delay:198ms]"
        >
          <span className="absolute inset-x-0 h-px bg-border-strong" />
          <span className="absolute left-0 h-[1.5px] w-[calc(var(--progress)*100%)] rounded-full bg-foreground transition-[width] duration-[440ms] ease-standard" />
          <span
            data-done={p >= 1 || undefined}
            className="absolute left-[calc(var(--progress)*100%)] size-2.5 -translate-x-1/2 rounded-full bg-tool transition-[left] duration-[440ms] ease-standard data-done:animate-pop"
          />
        </span>
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
