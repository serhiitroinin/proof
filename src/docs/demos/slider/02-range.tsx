import { Slider } from "@/components/ui/slider"

export default function SliderRange() {
  return <Slider defaultValue={[20, 65]} className="max-w-xs" aria-label="Price range" />
}
