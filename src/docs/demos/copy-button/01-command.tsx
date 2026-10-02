import { CopyButton } from "@/components/ui/copy-button"

export default function CopyButtonCommand() {
  return (
    <div className="flex w-full max-w-sm items-center gap-2 rounded-md border bg-muted py-2 pr-2 pl-3 font-mono text-xs shadow-well">
      <code className="min-w-0 flex-1 truncate">
        <span className="text-faint">$ </span>brew install butler
      </code>
      <CopyButton text="brew install butler" variant="ghost" />
    </div>
  )
}
