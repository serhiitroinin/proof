import { Spinner } from "@/components/ui/spinner"

export default function SpinnerMatrix() {
  return (
    <div className="flex items-center gap-6">
      <Spinner variant="matrix" />
      <Spinner variant="matrix" className="size-8" />
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Spinner variant="matrix" className="size-6" />
        Reading 1,204 files
      </div>
    </div>
  )
}
