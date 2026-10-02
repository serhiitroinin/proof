import { Figure, FigureUnit, FigureValue } from "@/components/ui/figure"

export default function FigureUnits() {
  return (
    <div className="flex flex-wrap items-end gap-10">
      <Figure>
        <FigureValue value="7.3" units="plain">
          <FigureUnit>h</FigureUnit>
        </FigureValue>
      </Figure>
      <Figure>
        <FigureValue value="7.3" units="accent">
          <FigureUnit>h</FigureUnit>
        </FigureValue>
      </Figure>
      <Figure>
        <FigureValue value="7.3" units="mono">
          <FigureUnit>h</FigureUnit>
        </FigureValue>
      </Figure>
      <Figure>
        <FigureValue value={128} size="lg">
          <FigureUnit>files</FigureUnit>
        </FigureValue>
      </Figure>
    </div>
  )
}
