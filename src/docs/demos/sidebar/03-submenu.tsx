import { useState } from "react"
import { ChevronRightIcon, DownloadIcon, ListChecksIcon, MonitorIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

const rules = ["Screenshots", "Installers", "Receipts", "Archives"]

export default function SidebarSubmenu() {
  const [active, setActive] = useState("rules/Installers")
  const [open, setOpen] = useState(true)
  return (
    <div className="flex h-96 w-full overflow-hidden rounded-lg border">
      <SidebarProvider className="min-h-0">
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Library</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={active === "downloads"} onClick={() => setActive("downloads")}>
                      <DownloadIcon />
                      <span>Downloads</span>
                      <SidebarMenuBadge>128</SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={active === "desktop"} onClick={() => setActive("desktop")}>
                      <MonitorIcon />
                      <span>Desktop</span>
                      <SidebarMenuBadge>12</SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Rules</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={active === "rules"} onClick={() => setActive("rules")}>
                      <ListChecksIcon />
                      <span>All rules</span>
                      <SidebarMenuBadge>{rules.length}</SidebarMenuBadge>
                    </SidebarMenuButton>
                    <SidebarMenuAction aria-label={open ? "Collapse" : "Expand"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
                      <ChevronRightIcon className="transition-transform aria-expanded:rotate-90" aria-expanded={open} />
                    </SidebarMenuAction>
                    {open && (
                      <SidebarMenuSub>
                        {rules.map((r) => (
                          <SidebarMenuSubItem key={r}>
                            <SidebarMenuSubButton render={<button type="button" />} isActive={active === `rules/${r}`} onClick={() => setActive(`rules/${r}`)}>
                              <span>{r}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="flex-1 p-4 text-sm text-muted-foreground">
            Sub items hang off an inset hairline. The marker follows the pointer as a ghost and returns to <span className="font-mono text-foreground">{active}</span> when you leave.
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
