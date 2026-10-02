import { Slider } from "@/components/ui/slider"

export default function SliderDisabled() {
  return <Slider defaultValue={[55]} disabled className="max-w-xs" aria-label="Disabled" />
}
