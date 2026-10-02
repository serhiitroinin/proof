import { Spinner } from "@/components/ui/spinner"

export default function SpinnerBasic() {
  return (
    <>
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </>
  )
}
