import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function ButtonStates() {
  return (
    <>
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled>
        Disabled
      </Button>
      <Button variant="ghost" disabled>
        Disabled
      </Button>
      <Button variant="destructive" disabled>
        Disabled
      </Button>
      <Button disabled aria-busy="true">
        <Spinner data-icon="inline-start" />
        Publishing
      </Button>
      <Button variant="outline" disabled aria-busy="true">
        <Spinner data-icon="inline-start" />
        Saving
      </Button>
      <Button variant="outline" aria-expanded="true">
        Expanded
      </Button>
    </>
  )
}
