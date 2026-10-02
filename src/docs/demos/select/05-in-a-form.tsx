import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const roles = { viewer: "Viewer", editor: "Editor", admin: "Admin" }

export default function SelectInAForm() {
  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="invite-email">Email</FieldLabel>
        <Input id="invite-email" type="email" placeholder="colleague@northwind.com" />
      </Field>
      <Field>
        <FieldLabel htmlFor="invite-role">Role</FieldLabel>
        <Select items={roles} defaultValue="editor">
          <SelectTrigger id="invite-role" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <FieldDescription>Admins can manage billing and members.</FieldDescription>
      </Field>
      <Button className="self-start">Send invite</Button>
    </FieldGroup>
  )
}
