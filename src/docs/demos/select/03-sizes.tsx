import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const branches = { main: "main", develop: "develop", release: "release/1.4" }

export default function SelectSizes() {
  return (
    <>
      <Select items={branches} defaultValue="main">
        <SelectTrigger size="sm" aria-label="Branch">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="main">main</SelectItem>
          <SelectItem value="develop">develop</SelectItem>
          <SelectItem value="release">release/1.4</SelectItem>
        </SelectContent>
      </Select>
      <Select items={branches} defaultValue="main">
        <SelectTrigger aria-label="Branch">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="main">main</SelectItem>
          <SelectItem value="develop">develop</SelectItem>
          <SelectItem value="release">release/1.4</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}
