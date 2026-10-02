import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const sides = ["top", "right", "bottom", "left"] as const

export default function TooltipSides() {
  return (
    <>
      {sides.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline" />}>{side[0].toUpperCase() + side.slice(1)}</TooltipTrigger>
          <TooltipContent side={side}>Opens on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </>
  )
}
