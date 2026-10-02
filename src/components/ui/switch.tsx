"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

// In dark mode the off thumb goes muted, so it reads on the dark track.
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full bg-fill-active px-0.5 shadow-well ring-1 ring-border-control ring-inset transition-[background-color,box-shadow,outline-color] outline-2 outline-offset-2 outline-transparent group-has-[:focus-visible]/field-label:outline-none after:absolute after:-inset-x-3 after:-inset-y-2 hover:ring-muted-foreground focus-visible:outline-ring aria-invalid:ring-destructive aria-invalid:focus-visible:outline-destructive data-[size=default]:h-4 data-[size=default]:w-7 data-[size=sm]:h-3 data-[size=sm]:w-5 data-checked:bg-primary data-checked:ring-transparent data-checked:hover:ring-transparent data-disabled:cursor-not-allowed data-disabled:opacity-45 data-disabled:shadow-none",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-card shadow-thumb transition-[translate,width] ease-standard group-data-[size=default]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-3 group-data-[size=default]/switch:group-active/switch:w-[15px] group-data-[size=default]/switch:group-active/switch:data-checked:translate-x-[9px] group-data-[size=sm]/switch:size-2 group-data-[size=sm]/switch:data-checked:translate-x-2 group-data-[size=sm]/switch:group-active/switch:w-2.5 group-data-[size=sm]/switch:group-active/switch:data-checked:translate-x-1.5 data-unchecked:translate-x-0 dark:bg-muted-foreground dark:data-checked:bg-primary-foreground"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
