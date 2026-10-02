import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-md border border-border-strong bg-card px-3 text-sm text-foreground shadow-well transition-[color,background-color,border-color,box-shadow] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-faint hover:border-border-heavy focus-visible:border-ring focus-visible:shadow-none focus-visible:ring-1 focus-visible:ring-ring [&[readonly]]:border-dashed [&[readonly]]:bg-muted [&[readonly]]:text-muted-foreground [&[readonly]]:shadow-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border disabled:border-solid disabled:bg-muted disabled:text-faint disabled:shadow-none aria-invalid:border-destructive aria-invalid:hover:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
