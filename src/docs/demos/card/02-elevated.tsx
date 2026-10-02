import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardElevated() {
  return (
    <Card variant="elevated" className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <CardDescription>412 GB of 1 TB used</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Installers older than 30 days can be trashed to free 18 GB.</p>
      </CardContent>
    </Card>
  )
}
