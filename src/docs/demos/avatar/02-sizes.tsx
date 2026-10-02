import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AvatarSizes() {
  return (
    <>
      <Avatar size="sm">
        <AvatarFallback>IO</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>IO</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>IO</AvatarFallback>
      </Avatar>
    </>
  )
}
