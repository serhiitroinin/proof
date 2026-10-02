import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsLine() {
  return (
    <Tabs defaultValue="code" className="w-full max-w-sm">
      <TabsList variant="line">
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="issues">Issues</TabsTrigger>
        <TabsTrigger value="pulls">Pull requests</TabsTrigger>
      </TabsList>
      <TabsContent value="code">
        <p className="text-muted-foreground">42 files, last commit 3 minutes ago.</p>
      </TabsContent>
      <TabsContent value="issues">
        <p className="text-muted-foreground">7 open, 128 closed.</p>
      </TabsContent>
      <TabsContent value="pulls">
        <p className="text-muted-foreground">2 open, waiting on review.</p>
      </TabsContent>
    </Tabs>
  )
}
