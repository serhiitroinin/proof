import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// `flash` washes the row in the tool tint for 1.4s. Set it for one render pass or re-key the row.

const tableVariants = cva("relative w-full overflow-x-auto", {
  variants: {
    variant: {
      surface: "rounded-lg border border-card-border bg-card text-card-foreground",
      plain: "",
    },
    density: {
      default: "",
      compact: "",
    },
  },
  defaultVariants: {
    variant: "surface",
    density: "default",
  },
})

function Table({
  className,
  variant = "surface",
  density = "default",
  ...props
}: React.ComponentProps<"table"> & VariantProps<typeof tableVariants>) {
  return (
    <div
      data-slot="table-container"
      data-variant={variant}
      data-density={density}
      className={cn("group/table", tableVariants({ variant, density }))}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm tabular-nums", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-muted [&_tr]:border-b [&_tr]:hover:bg-muted", className)}
      {...props}
    />
  )
}

const STAGGER =
  "[&>tr]:animate-rise [&>tr:nth-child(2)]:[animation-delay:28ms] [&>tr:nth-child(3)]:[animation-delay:56ms] [&>tr:nth-child(4)]:[animation-delay:84ms] [&>tr:nth-child(5)]:[animation-delay:112ms] [&>tr:nth-child(6)]:[animation-delay:140ms] [&>tr:nth-child(7)]:[animation-delay:168ms] [&>tr:nth-child(8)]:[animation-delay:196ms] [&>tr:nth-child(9)]:[animation-delay:224ms] [&>tr:nth-child(10)]:[animation-delay:252ms] [&>tr:nth-child(11)]:[animation-delay:280ms] [&>tr:nth-child(12)]:[animation-delay:308ms] [&>tr:nth-child(n+13)]:[animation-delay:336ms]"

function TableBody({
  className,
  stagger = true,
  ...props
}: React.ComponentProps<"tbody"> & { stagger?: boolean }) {
  return (
    <tbody
      data-slot="table-body"
      data-stagger={stagger || undefined}
      className={cn("[&_tr:last-child]:border-0", stagger && STAGGER, className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted font-medium [&>tr]:last:border-b-0 [&_tr]:hover:bg-muted",
        className
      )}
      {...props}
    />
  )
}

const tableRowVariants = cva(
  "border-b transition-colors duration-100 outline-none hover:bg-fill focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset data-[state=selected]:bg-tool-subtle data-[state=selected]:text-tool-text data-[state=selected]:hover:bg-tool-subtle aria-disabled:text-faint aria-disabled:hover:bg-transparent aria-expanded:bg-fill",
  {
    variants: {
      variant: {
        default: "",
        group: "bg-muted text-xs font-medium text-muted-foreground hover:bg-muted",
        detail: "bg-muted hover:bg-muted",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function TableRow({
  className,
  variant = "default",
  flash,
  ...props
}: React.ComponentProps<"tr"> & VariantProps<typeof tableRowVariants> & { flash?: boolean }) {
  return (
    <tr
      data-slot="table-row"
      data-variant={variant}
      data-flash={flash || undefined}
      className={cn(tableRowVariants({ variant }), flash && "animate-flash", className)}
      {...props}
    />
  )
}

const tableCellVariants = cva("", {
  variants: {
    variant: {
      default: "",
      muted: "text-muted-foreground",
      numeric: "text-right tabular-nums",
      mono: "font-mono text-[0.8125rem]",
    },
    tone: {
      default: "",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: { variant: "default", tone: "default" },
})

function TableHead({
  className,
  variant = "default",
  tone = "default",
  ...props
}: React.ComponentProps<"th"> & VariantProps<typeof tableCellVariants>) {
  return (
    <th
      data-slot="table-head"
      data-variant={variant}
      data-tone={tone}
      className={cn(
        "h-10 px-3 text-left align-middle text-xs font-medium whitespace-nowrap text-muted-foreground first:pl-4 last:pr-4 group-data-[density=compact]/table:h-8 group-data-[density=compact]/table:px-2 group-data-[density=compact]/table:first:pl-3 group-data-[density=compact]/table:last:pr-3 [&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pr-0 [&>[data-slot=button]]:-ml-2 [&>[data-slot=button]]:h-6 [&>[data-slot=button]]:text-xs [&>[data-slot=button]]:text-muted-foreground aria-[sort=ascending]:[&>[data-slot=button]]:text-foreground aria-[sort=descending]:[&>[data-slot=button]]:text-foreground",
        tableCellVariants({ variant, tone }),
        variant === "mono" && "font-sans text-xs",
        className
      )}
      {...props}
    />
  )
}

function TableCell({
  className,
  variant = "default",
  tone = "default",
  ...props
}: React.ComponentProps<"td"> & VariantProps<typeof tableCellVariants>) {
  return (
    <td
      data-slot="table-cell"
      data-variant={variant}
      data-tone={tone}
      className={cn(
        "h-10 px-3 py-2 align-middle whitespace-nowrap first:pl-4 last:pr-4 group-data-[density=compact]/table:h-8 group-data-[density=compact]/table:px-2 group-data-[density=compact]/table:first:pl-3 group-data-[density=compact]/table:last:pr-3 [&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pr-0 [&>[data-slot=checkbox]]:align-middle",
        tableCellVariants({ variant, tone }),
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableVariants,
  tableRowVariants,
  tableCellVariants,
}
