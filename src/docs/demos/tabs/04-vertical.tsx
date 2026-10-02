import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsVertical() {
  return (
    <Tabs defaultValue="general" orientation="vertical" className="w-full max-w-md">
      <TabsList variant="line" className="w-32">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <p className="text-muted-foreground">Workspace name, URL and default branch.</p>
      </TabsContent>
      <TabsContent value="members">
        <p className="text-muted-foreground">12 members, 2 pending invites.</p>
      </TabsContent>
      <TabsContent value="billing">
        <p className="text-muted-foreground">Pro plan, renews 1 November.</p>
      </TabsContent>
    </Tabs>
  )
}
