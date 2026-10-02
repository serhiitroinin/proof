import { Badge } from "@/components/ui/badge"

export default function BadgeStatus() {
  return (
    <>
      <Badge variant="success" dot>
        Live
      </Badge>
      <Badge variant="info" dot>
        Building
      </Badge>
      <Badge variant="warning" dot>
        Degraded
      </Badge>
      <Badge variant="destructive" dot>
        Failed
      </Badge>
      <Badge variant="secondary" dot>
        Paused
      </Badge>
    </>
  )
}
