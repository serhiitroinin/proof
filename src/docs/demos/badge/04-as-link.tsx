import { Badge } from "@/components/ui/badge"

export default function BadgeAsLink() {
  return (
    <>
      <Badge render={<a href="#badge" />}>v0.4.2</Badge>
      <Badge variant="outline" render={<a href="#badge" />}>
        12 open
      </Badge>
    </>
  )
}
