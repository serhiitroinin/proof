import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CardSmall() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-4">
      <Card size="sm" variant="flat">
        <CardHeader>
          <CardDescription>Time in range</CardDescription>
          <CardTitle>78%</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Last 14 days</p>
        </CardContent>
      </Card>
      <Card size="sm" variant="flat">
        <CardHeader>
          <CardDescription>Mean glucose</CardDescription>
          <CardTitle>7.4 mmol/L</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Down 0.3 from last week</p>
        </CardContent>
      </Card>
    </div>
  )
}
