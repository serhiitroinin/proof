import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const roles = { viewer: "Viewer", editor: "Editor", admin: "Admin" }

export default function SelectStates() {
  return (
    <>
      <Select items={roles} defaultValue="viewer" disabled>
        <SelectTrigger className="w-40" aria-label="Role">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
      <Select items={roles}>
        <SelectTrigger className="w-40" aria-invalid aria-label="Role">
          <SelectValue placeholder="Pick a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="viewer">Viewer</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}
