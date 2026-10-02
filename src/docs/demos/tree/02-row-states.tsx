import { HashIcon, ImageIcon, SquareIcon, TypeIcon } from "lucide-react"

import { TreeItem } from "@/components/ui/tree"

const noop = () => {}

export default function TreeRowStates() {
  return (
    <div className="grid w-full max-w-lg grid-cols-[auto_1fr] items-center gap-x-6 gap-y-1">
      <Label>Rest</Label>
      <TreeItem label="Headline" icon={<TypeIcon />} depth={1} onEye={noop} onLock={noop} />
      <Label>Hover</Label>
      <TreeItem label="Subhead" icon={<TypeIcon />} depth={1} hover onEye={noop} onLock={noop} />
      <Label>Selected</Label>
      <TreeItem label="Button" icon={<SquareIcon />} depth={1} selected onEye={noop} onLock={noop} />
      <Label>Open</Label>
      <TreeItem label="Hero" icon={<HashIcon />} hasChildren open onEye={noop} onLock={noop} />
      <Label>Hidden</Label>
      <TreeItem label="Promo banner" icon={<SquareIcon />} hidden onEye={noop} onLock={noop} />
      <Label>Locked</Label>
      <TreeItem label="Cover" icon={<ImageIcon />} locked onEye={noop} onLock={noop} />
      <Label>Renaming</Label>
      <TreeItem label="Button" icon={<SquareIcon />} depth={1} selected renaming />
      <Label>Drop into</Label>
      <TreeItem label="Hero" icon={<HashIcon />} hasChildren drop="into" />
      <Label>Drop below</Label>
      <TreeItem label="Cover" icon={<ImageIcon />} drop="below" />
    </div>
  )
}

function Label({ children }: { children: string }) {
  return <span className="text-xs text-muted-foreground">{children}</span>
}
