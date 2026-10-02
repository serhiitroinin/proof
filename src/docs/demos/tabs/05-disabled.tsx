import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsDisabled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="text-muted-foreground">Billing opens once the workspace has an owner.</p>
        </TabsContent>
        <TabsContent value="activity">
          <p className="text-muted-foreground">No activity yet.</p>
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="text-muted-foreground">Billing opens once the workspace has an owner.</p>
        </TabsContent>
        <TabsContent value="activity">
          <p className="text-muted-foreground">No activity yet.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
