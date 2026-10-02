import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import type { ToolName } from "@/components/ui/tool-mark"

// Sets --tool from the family colour and derives the dependent tokens with color-mix, so a
// page never spells out a colour.

const toolScopeVariants = cva(
  [
    "[--tool-foreground:var(--background)]",
    "[--tool-subtle:color-mix(in_oklab,var(--tool)_14%,var(--background))]",
    "[--tool-text:color-mix(in_oklab,var(--tool)_72%,var(--foreground))]",
    "[--tool-border:color-mix(in_oklab,var(--tool)_45%,var(--background))]",
    "[--ring:var(--tool)]",
    "[--selection:color-mix(in_oklab,var(--tool)_20%,var(--background))]",
    "selection:bg-selection",
  ],
  {
    variants: {
      tool: {
        butler: "[--tool:var(--family-butler)]",
        easel: "[--tool:var(--family-easel)]",
        sculpt: "[--tool:var(--family-sculpt)]",
        reins: "[--tool:var(--family-reins)]",
        glu: "[--tool:var(--family-glu)]",
        strap: "[--tool:var(--family-strap)]",
        vellum: "[--tool:var(--family-vellum)]",
      },
    },
    defaultVariants: { tool: "butler" },
  }
)

type ToolScopeProps = React.ComponentProps<"div"> & VariantProps<typeof toolScopeVariants> & { tool?: ToolName }

function ToolScope({ tool = "butler", className, ...props }: ToolScopeProps) {
  return <div data-slot="tool-scope" data-tool={tool} className={cn(toolScopeVariants({ tool }), className)} {...props} />
}

export { ToolScope, toolScopeVariants }
export type { ToolScopeProps }
