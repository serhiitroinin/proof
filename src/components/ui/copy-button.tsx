import * as React from "react"
import { CopyIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { MotifDot } from "@/components/ui/motif"

// The label keeps a minimum width so the button does not jump between states.

type CopyButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick" | "children"> & {
  /** Text written to the clipboard. */
  text: string
  children?: React.ReactNode
  copiedLabel?: React.ReactNode
  onCopied?: (text: string) => void
}

function CopyButton({
  text,
  children = "Copy",
  copiedLabel = "Copied",
  onCopied,
  variant = "outline",
  size = "sm",
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1760)
    return () => clearTimeout(t)
  }, [copied])
  const iconOnly = typeof size === "string" && size.startsWith("icon")
  return (
    <Button
      data-slot="copy-button"
      data-state={copied ? "copied" : "idle"}
      variant={variant}
      size={size}
      aria-label={iconOnly ? (copied ? "Copied" : "Copy") : undefined}
      aria-live="polite"
      className={cn(!iconOnly && "min-w-21 justify-center", className)}
      onClick={() => {
        navigator.clipboard?.writeText(text)
        setCopied(true)
        onCopied?.(text)
      }}
      {...props}
    >
      {copied ? (
        <>
          <MotifDot size={10} data-icon={iconOnly ? undefined : "inline-start"} />
          {!iconOnly && copiedLabel}
        </>
      ) : (
        <>
          <CopyIcon data-icon={iconOnly ? undefined : "inline-start"} />
          {!iconOnly && children}
        </>
      )}
    </Button>
  )
}

export { CopyButton }
export type { CopyButtonProps }
