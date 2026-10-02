import { Separator } from "@/components/ui/separator"

export default function SeparatorHorizontal() {
  return (
    <div className="w-full max-w-sm">
      <p className="text-sm font-medium">Butler</p>
      <p className="text-sm text-muted-foreground">Keeps Downloads and Desktop in order.</p>
      <Separator className="my-4" />
      <p className="text-sm text-muted-foreground">Next check at 18:00.</p>
    </div>
  )
}
