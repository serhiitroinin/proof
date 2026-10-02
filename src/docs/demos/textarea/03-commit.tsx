import { useState } from "react"
import { toast } from "sonner"

import { Textarea } from "@/components/ui/textarea"

export default function TextareaCommit() {
  const [value, setValue] = useState("")
  return (
    <Textarea
      className="max-w-md"
      aria-label="Comment"
      placeholder="Leave a comment"
      minRows={2}
      maxRows={8}
      limit={500}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onCommit={(v) => {
        if (!v.trim()) return
        toast("Comment posted", { description: v.slice(0, 60) })
        setValue("")
      }}
    />
  )
}
