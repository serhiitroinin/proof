import { FolderIcon, SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ToolMark } from "@/components/ui/tool-mark"
import {
  Window,
  WindowBar,
  WindowBody,
  WindowFooter,
  WindowHeader,
  WindowMain,
  WindowSidebar,
  WindowToolbar,
} from "@/components/ui/window"

export default function WindowSidebarAndToolbar() {
  return (
    <Window className="h-80">
      <WindowBar>
        <WindowToolbar>
          <ToggleGroup defaultValue={["proposal"]} size="sm">
            <ToggleGroupItem value="proposal">Proposal</ToggleGroupItem>
            <ToggleGroupItem value="before">Before</ToggleGroupItem>
            <ToggleGroupItem value="after">After</ToggleGroupItem>
          </ToggleGroup>
        </WindowToolbar>
        <WindowToolbar align="end">
          <InputGroup className="w-44">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search files" />
          </InputGroup>
          <Button size="sm">Organise</Button>
        </WindowToolbar>
      </WindowBar>
      <WindowBody>
        <WindowSidebar width="narrow">
          <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium">
            <ToolMark tool="butler" size={16} />
            Butler
          </div>
          <div className="flex items-center gap-2 rounded-md bg-sidebar-accent px-2 py-1 text-sm">
            <FolderIcon className="size-4 text-muted-foreground" />
            Downloads
          </div>
          <div className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground">
            <FolderIcon className="size-4" />
            Desktop
          </div>
        </WindowSidebar>
        <WindowMain>
          <WindowHeader>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold tracking-tight">Downloads</span>
                <Badge variant="tool">Proposed</Badge>
              </div>
              <span className="text-xs text-muted-foreground">8 moves into 3 folders · 1 rename · 2 excluded</span>
            </div>
          </WindowHeader>
          <div className="flex-1 p-5 text-sm text-muted-foreground">The plan table goes here.</div>
        </WindowMain>
      </WindowBody>
      <WindowFooter>
        <span className="text-xs text-muted-foreground">8 moves · 2 excluded</span>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Reject
          </Button>
          <Button size="sm">Approve</Button>
        </div>
      </WindowFooter>
    </Window>
  )
}
