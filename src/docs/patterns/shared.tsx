import { Fragment } from "react"

import { Kbd } from "@/components/ui/kbd"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Space-separated caps: "⌘ K" renders two Kbd, "/" renders as "or".
export function Keys({ rows }: { rows: [keys: string, does: string][] }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">Key</TableHead>
            <TableHead>Does</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([k, v]) => (
            <TableRow key={k}>
              <TableCell>
                <span className="flex flex-wrap items-center gap-1">
                  {k.split(" ").map((x, i) =>
                    x === "/" || x === "·" ? (
                      <span key={i} className="px-0.5 text-xs text-faint">
                        {x === "/" ? "or" : "·"}
                      </span>
                    ) : (
                      <Fragment key={i}>
                        <Kbd>{x}</Kbd>
                      </Fragment>
                    )
                  )}
                </span>
              </TableCell>
              <TableCell variant="muted">{v}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function Meta({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>
}
