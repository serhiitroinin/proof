import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsDefault() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-muted-foreground">Three deploys this week. The last one shipped 2 hours ago.</p>
      </TabsContent>
      <TabsContent value="activity">
        <p className="text-muted-foreground">Mira merged “Tighten focus rings” into main.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-muted-foreground">Production branch: main. Preview branches: all.</p>
      </TabsContent>
    </Tabs>
  )
}
