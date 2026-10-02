import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const sides = ["top", "right", "bottom", "left"] as const

export default function SheetSides() {
  return (
    <>
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" />}>{side[0].toUpperCase() + side.slice(1)}</SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>From the {side}</SheetTitle>
              <SheetDescription>Top and bottom sheets size to their content; left and right fill the height.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </>
  )
}
