import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"

export default function AvatarWithBadge() {
  return (
    <>
      <Avatar size="sm">
        <AvatarFallback>IO</AvatarFallback>
        <AvatarBadge aria-label="Online" />
      </Avatar>
      <Avatar>
        <AvatarFallback>IO</AvatarFallback>
        <AvatarBadge aria-label="Online" />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>IO</AvatarFallback>
        <AvatarBadge aria-label="Online" />
      </Avatar>
    </>
  )
}
