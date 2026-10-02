import { Figure, FigureCaption, FigureStatus, FigureUnit, FigureValue } from "@/components/ui/figure"
import { MotifDot } from "@/components/ui/motif"

export default function FigureBasic() {
  return (
    <Figure>
      <FigureCaption>Sleep · 14 nights</FigureCaption>
      <FigureValue value="7.3">
        <FigureUnit>h</FigureUnit>
      </FigureValue>
      <FigureStatus>
        <MotifDot size={6} tone="tool" />
        Above your 30-day average on 9 of 14 nights.
      </FigureStatus>
    </Figure>
  )
}
