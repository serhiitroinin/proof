import { Slider } from "@/components/ui/slider"

export default function SliderVertical() {
  return (
    <div className="flex h-40 gap-8">
      <Slider orientation="vertical" defaultValue={[30]} aria-label="Bass" />
      <Slider orientation="vertical" defaultValue={[60]} aria-label="Mid" />
      <Slider orientation="vertical" defaultValue={[45]} aria-label="Treble" />
    </div>
  )
}
