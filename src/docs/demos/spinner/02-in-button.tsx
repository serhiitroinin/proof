import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function SpinnerInButton() {
  return (
    <>
      <Button disabled>
        <Spinner data-icon="inline-start" />
        Saving…
      </Button>
      <Button variant="outline" disabled>
        <Spinner data-icon="inline-start" />
        Syncing
      </Button>
    </>
  )
}
