import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// The accent fill follows `tool` through data-[tool=…], so a page can place any mark without
// a dynamic class.

type ToolName = "butler" | "easel" | "sculpt" | "reins" | "glu" | "strap" | "vellum"

const toolMarkVariants = cva(
  "block shrink-0 overflow-visible stroke-foreground stroke-[3] [stroke-linecap:round] [stroke-linejoin:round]",
  {
    variants: {
      tool: {
        butler: "[&_[data-accent]]:fill-family-butler",
        easel: "[&_[data-accent]]:fill-family-easel",
        sculpt: "[&_[data-accent]]:fill-family-sculpt [&_[data-accent][data-accent=stroke]]:stroke-family-sculpt",
        reins: "[&_[data-accent]]:fill-family-reins",
        glu: "[&_[data-accent]]:fill-family-glu",
        strap: "[&_[data-accent]]:fill-family-strap",
        vellum: "[&_[data-accent]]:fill-family-vellum",
      },
    },
    defaultVariants: { tool: "butler" },
  }
)

const SHAPES: Record<ToolName, React.ReactNode> = {
  reins: (
    <>
      <rect data-accent stroke="none" x="10" y="5.5" width="12" height="7" rx="1.5" />
      <path d="M8.5 13 16 27.5 23.5 13" />
      <circle cx="8" cy="9" r="3.5" />
      <circle cx="24" cy="9" r="3.5" />
    </>
  ),
  easel: (
    <>
      <path d="M16 4.5v2M5.5 22.5h21M11.5 22.5l-2 5M20.5 22.5l2 5" />
      <rect data-accent stroke="none" x="7" y="7" width="18" height="12.5" rx="1.5" />
    </>
  ),
  sculpt: (
    <>
      <path d="M16 4.5 26 10v12l-10 5.5L6 22V10zM6 10l6 3.3M26 10l-6 3.3M16 27.5V21" />
      <path data-accent="stroke" d="M12.8 14.2h6.4L16 19.8z" />
    </>
  ),
  butler: (
    <>
      <path d="M12.5 13 5 8.5v15l7.5-4.5M19.5 13 27 8.5v15L19.5 19" />
      <rect data-accent stroke="none" x="12" y="11" width="8" height="10" rx="2" />
    </>
  ),
  glu: (
    <>
      <path d="M4.5 19c3.5 0 4-8 7.5-8s4 10 7.5 10 4-6 7.5-6" />
      <circle data-accent stroke="none" cx="19.5" cy="21" r="3.6" />
    </>
  ),
  strap: (
    <>
      <path d="M4.5 16h6l2.5-6 4.5 12 2.5-6h7.5" />
      <rect data-accent stroke="none" x="9" y="25" width="14" height="3" rx="1.5" />
    </>
  ),
  vellum: (
    <>
      <path d="M8 5.5h11l5 5v16H8z" />
      <path data-accent stroke="none" d="M12 15h8v3h-8zM12 20.5h5v3h-5z" />
    </>
  ),
}

const TOOLS = Object.keys(SHAPES) as ToolName[]

type ToolMarkProps = Omit<React.ComponentProps<"svg">, "width" | "height"> &
  VariantProps<typeof toolMarkVariants> & {
    tool?: ToolName
    /** Rendered size in px (the mark is square). */
    size?: number
  }

function ToolMark({ tool = "butler", size = 24, className, ...props }: ToolMarkProps) {
  return (
    <svg
      data-slot="tool-mark"
      data-tool={tool}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label={`${tool} mark`}
      className={cn(toolMarkVariants({ tool }), className)}
      {...props}
    >
      {SHAPES[tool]}
    </svg>
  )
}

export { ToolMark, TOOLS, toolMarkVariants }
export type { ToolMarkProps, ToolName }
