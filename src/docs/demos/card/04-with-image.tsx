import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CardWithImage() {
  return (
    <Card className="w-full max-w-sm">
      <img
        src="https://picsum.photos/seed/proof-card/640/320"
        alt="A grey cliff above a calm sea"
        width={640}
        height={320}
        className="aspect-video w-full object-cover"
      />
      <CardHeader>
        <CardTitle>Vestmannaeyjar</CardTitle>
        <CardDescription>Imported Tuesday from IMG_4471.heic</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">3.8 MB, 4032 by 3024.</p>
      </CardContent>
    </Card>
  )
}
