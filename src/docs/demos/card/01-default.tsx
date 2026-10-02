import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardDefault() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Backups</CardTitle>
        <CardDescription>Nightly snapshot of the vault to the local disk.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Last run finished at 03:12 and kept 14 days. The next run is tonight at 03:00.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Run now
        </Button>
        <Button variant="ghost" size="sm">
          History
        </Button>
      </CardFooter>
    </Card>
  )
}
