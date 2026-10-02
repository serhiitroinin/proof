import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AvatarDefault() {
  return (
    <>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/80?img=32" alt="Ines Okafor" />
        <AvatarFallback>IO</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>TL</AvatarFallback>
      </Avatar>
    </>
  )
}
