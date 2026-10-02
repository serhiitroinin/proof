import { CheckIcon, ClockIcon, GitBranchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export default function BadgeWithIcon() {
  return (
    <>
      <Badge variant="outline">
        <GitBranchIcon />
        main
      </Badge>
      <Badge variant="success">
        <CheckIcon />
        Merged
      </Badge>
      <Badge variant="secondary">
        <ClockIcon />
        2 min ago
      </Badge>
    </>
  )
}
