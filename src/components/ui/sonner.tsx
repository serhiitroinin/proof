import { Toaster as Sonner, type ToasterProps } from "sonner"
import { cn } from "cn"
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"

// Pass the same `duration` to the Toaster and to toasts that override it, so the line and
// the timer agree.
const Toaster = ({ theme = "system", duration = 4000, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      duration={duration}
      className="group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4 text-info" />,
        warning: <TriangleAlertIcon className="size-4 text-warning" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--card-border)",
          "--border-radius": "var(--radius-md)",
          "--toast-life": `${duration}ms`,
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group/toast font-sans! text-sm! gap-3! shadow-lg! pb-6!",
          // The pseudos hang off the unpositioned content so they resolve against the toast box;
          // sonner reserves the toast's own ::before/::after for swipe and hover bridging.
          content: cn(
            "before:pointer-events-none before:absolute before:inset-x-4 before:bottom-3 before:h-[1.5px] before:rounded-full before:bg-[linear-gradient(to_right,var(--foreground)_50%,transparent_50%)] before:bg-[length:200%_100%] before:bg-no-repeat before:animate-[shimmer_var(--toast-life)_linear_both_reverse]",
            "after:pointer-events-none after:absolute after:inset-x-3 after:bottom-[8.75px] after:h-2 after:bg-[radial-gradient(circle,var(--tool)_3.25px,transparent_4px)] after:bg-[length:8px_8px] after:bg-no-repeat after:animate-[shimmer_var(--toast-life)_linear_both]",
            "group-data-[expanded=true]/toast:before:paused group-data-[expanded=true]/toast:after:paused group-data-[type=loading]/toast:before:hidden group-data-[type=loading]/toast:after:hidden"
          ),
          title: "font-medium!",
          description: "text-muted-foreground!",
          actionButton: "rounded-sm! font-medium!",
          cancelButton: "rounded-sm! font-medium!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
