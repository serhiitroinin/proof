import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sections = [
  { value: "plan", label: "Plan", body: "9 moves queued. Nothing has been touched yet." },
  { value: "moves", label: "Moves", body: "Invoices → Documents/Invoices, Screenshots → Pictures/Screenshots…" },
  { value: "history", label: "History", body: "Last run yesterday at 18:02, 14 files moved." },
  { value: "rules", label: "Rules", body: "4 rules. Receipts match on sender, the rest on extension." },
]

export default function TabsInchworm() {
  return (
    <div className="grid w-full max-w-sm gap-8">
      <Tabs defaultValue="plan">
        <TabsList variant="line">
          {sections.map((s) => (
            <TabsTrigger key={s.value} value={s.value}>
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {sections.map((s) => (
          <TabsContent key={s.value} value={s.value}>
            <p className="text-muted-foreground">{s.body}</p>
          </TabsContent>
        ))}
      </Tabs>
      <Tabs defaultValue="plan">
        <TabsList>
          {sections.map((s) => (
            <TabsTrigger key={s.value} value={s.value}>
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {sections.map((s) => (
          <TabsContent key={s.value} value={s.value}>
            <p className="text-muted-foreground">{s.body}</p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
