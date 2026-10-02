import { ArrowUpRightIcon, TriangleAlertIcon } from "lucide-react"

import { Figure, FigureCaption, FigureSparkline, FigureStatus, FigureUnit, FigureValue } from "@/components/ui/figure"

export default function FigureSparklines() {
  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-8">
      <Figure>
        <FigureCaption>Resting heart rate</FigureCaption>
        <div className="flex items-end justify-between gap-4">
          <FigureValue value={52} size="sm">
            <FigureUnit>bpm</FigureUnit>
          </FigureValue>
          <FigureSparkline data={[58, 57, 55, 56, 54, 53, 54, 52]} tone="foreground" dot />
        </div>
        <FigureStatus tone="success">
          <ArrowUpRightIcon />
          Down 6 over two weeks
        </FigureStatus>
      </Figure>
      <Figure>
        <FigureCaption>Time in range</FigureCaption>
        <div className="flex items-end justify-between gap-4">
          <FigureValue value={68} size="sm" units="mono">
            <FigureUnit>%</FigureUnit>
          </FigureValue>
          <FigureSparkline data={[74, 72, 75, 70, 66, 69, 71, 68]} />
        </div>
        <FigureStatus tone="warning">
          <TriangleAlertIcon />
          Below the 70% target
        </FigureStatus>
      </Figure>
    </div>
  )
}
