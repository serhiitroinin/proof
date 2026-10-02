import { InboxIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function SidebarInsetLoading() {
  return (
    <div className="flex h-96 w-full overflow-hidden rounded-lg border bg-sidebar">
      <SidebarProvider className="min-h-0">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader>
            <SidebarInput placeholder="Search projects" className="group-data-[collapsible=icon]:hidden" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Inbox</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="All">
                      <InboxIcon />
                      <span>All</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu marker={false}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 px-3">
            <SidebarTrigger />
            <span className="text-sm font-medium">Inset variant</span>
          </header>
          <div className="flex-1 px-4 pb-4 text-sm text-muted-foreground">Project rows are loading.</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
