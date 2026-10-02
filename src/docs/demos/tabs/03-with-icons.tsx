import { CodeIcon, MessageSquareIcon, SettingsIcon } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsWithIcons() {
  return (
    <Tabs defaultValue="code" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="code">
          <CodeIcon />
          Code
        </TabsTrigger>
        <TabsTrigger value="comments">
          <MessageSquareIcon />
          Comments
        </TabsTrigger>
        <TabsTrigger value="settings" disabled>
          <SettingsIcon />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="code">
        <p className="text-muted-foreground">Source for the selected file.</p>
      </TabsContent>
      <TabsContent value="comments">
        <p className="text-muted-foreground">No comments yet.</p>
      </TabsContent>
    </Tabs>
  )
}
