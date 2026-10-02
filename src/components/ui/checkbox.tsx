"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "cn"

// The check stroke starts 0.3 dur after the fill, so the box is ink before the mark appears.
// Inside a choice card the card takes the focus ring.
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox peer relative flex size-4 shrink-0 items-center justify-center rounded-sm border border-border-control bg-card shadow-well transition-[color,background-color,border-color,box-shadow] outline-none group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:shadow-raise-control data-checked:sheen data-checked:hover:border-primary data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground data-indeterminate:shadow-raise-control data-indeterminate:sheen data-indeterminate:hover:border-primary data-disabled:cursor-not-allowed data-disabled:opacity-45 data-disabled:shadow-none data-disabled:bg-none data-disabled:hover:border-border-control aria-invalid:border-destructive aria-invalid:hover:border-destructive aria-invalid:focus-visible:ring-destructive",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        keepMounted
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="size-3 group-data-indeterminate/checkbox:hidden"
        >
          <path
            d="M5 12.5 10 17.5 19 7"
            pathLength={1}
            className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[176ms] ease-standard group-data-checked/checkbox:[stroke-dashoffset:0] group-data-checked/checkbox:delay-[66ms]"
          />
        </svg>
        <span className="hidden h-0.5 w-2 rounded-full bg-current group-data-indeterminate/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
