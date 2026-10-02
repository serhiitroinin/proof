import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "cn"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

// The dot leaves on the standard curve, not the overshoot, so it never scales through zero.
function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-border-control bg-card shadow-well transition-[color,background-color,border-color,box-shadow] outline-none group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:shadow-raise-control data-checked:sheen data-checked:hover:border-primary data-disabled:cursor-not-allowed data-disabled:opacity-45 data-disabled:shadow-none data-disabled:bg-none data-disabled:hover:border-border-control aria-invalid:border-destructive aria-invalid:hover:border-destructive aria-invalid:focus-visible:ring-destructive",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        keepMounted
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-primary-foreground opacity-0 transition-[scale,opacity] duration-[154ms] ease-standard group-data-checked/radio-group-item:scale-100 group-data-checked/radio-group-item:opacity-100 group-data-checked/radio-group-item:duration-[352ms] group-data-checked/radio-group-item:ease-pop" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
