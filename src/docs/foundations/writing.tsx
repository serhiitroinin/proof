import { Button } from "@/components/ui/button"

import { PageHeader, Section } from "../kit"
import { Bullets, Mono } from "./shared"

const VOICE = [
  ["Specific", "Move 26 files", "Counts and names, not categories."],
  ["Calm", "Couldn’t read ~/Desktop.", "No exclamation marks. No “Oops”."],
  ["Owned", "Butler proposes. You approve.", "Say who does what."],
  ["Plain", "Undo stays for 30 days.", "No jargon."],
] as const

export default function Page() {
  return (
    <>
      <PageHeader group="Foundations" title="Writing">
        Short sentences, in the reader’s words. Sentence case everywhere.
      </PageHeader>

      <Section title="Voice">
        <div className="grid gap-4 sm:grid-cols-2">
          {VOICE.map(([k, ex, note]) => (
            <div key={k} className="flex flex-col gap-1 rounded-lg border bg-card p-4">
              <span className="text-xs font-medium text-muted-foreground">{k}</span>
              <span className="text-base font-medium">{ex}</span>
              <p className="text-sm text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Sentences" note="Simplified Technical English (ASD-STE100).">
        <Bullets
          items={[
            <>One idea per sentence. Instructions: 20 words or fewer. Descriptions: 25 or fewer.</>,
            <>Active voice. Present tense. Imperative for instructions: “Use X”, not “You should use X”.</>,
            <>Common, literal words. No idioms, metaphors, marketing or filler.</>,
            <>One term per thing. Use the same word every time.</>,
            <>Do not repeat what the UI or the heading already shows.</>,
          ]}
        />
      </Section>

      <Section title="Labels" note="Field labels are nouns. Button labels are verbs.">
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-6">
          <Button>Move 26 files</Button>
          <Button variant="outline">Keep editing</Button>
          <Button>Discard draft</Button>
        </div>
        <Bullets
          items={[
            <>Buttons name the outcome: verb, object, count.</>,
            <>Each choice in a dialog says what it does. Not “Yes” and “No”.</>,
            <>Sentence case in buttons, titles, menu items and tabs. No uppercase labels.</>,
            <>No trailing punctuation in labels and titles. Descriptions and errors end with a full stop.</>,
            <>
              Buttons: three words or fewer. Menu items: verb and object, <Mono>Rename folder</Mono>.
            </>,
            <>Placeholders show the format: a field labelled Folder has the placeholder ~/Downloads.</>,
          ]}
        />
      </Section>

      <Section title="Errors and status" note="Say what happened, then what to do.">
        <div className="flex flex-col gap-2 rounded-lg border bg-background p-6 text-sm">
          <span>No folder at ~/Downlaods. Did you mean ~/Downloads?</span>
          <span>26 files moved</span>
          <span>Couldn’t reach WHOOP. Retrying in 30 s.</span>
        </div>
        <Bullets
          items={[
            <>Name the problem and the fix. Not “Invalid path”.</>,
            <>State the fact in past tense. Not “Success!”.</>,
            <>Say what the tool does next. Not “Something went wrong”.</>,
            <>Field errors sit under the field, name the rule and keep the typed value.</>,
            <>Toasts report background results. Anything the reader must act on gets a dialog or an inline alert.</>,
            <>Destructive confirmations name the thing: “Delete 3 rules?” with buttons Cancel and Delete 3 rules.</>,
            <>Empty states say what belongs here and offer the first action.</>,
          ]}
        />
      </Section>

      <Section title="Mechanics">
        <Bullets
          items={[
            <>Numerals for every number. Units with a thin space: 7.3 h, 182 KB, 30 s.</>,
            <>
              Paths, commands and tokens in mono: <Mono>~/Downloads</Mono>, <Mono>glu tir --days 14</Mono>, <Mono>bg-muted</Mono>.
            </>,
            <>Dates: ISO in data (2026-10-02), relative in UI (2 min ago), absolute on hover.</>,
            <>Curly quotes and apostrophes in UI text. Straight quotes in code.</>,
            <>Second person for the reader. The product by name for itself. Not “we”.</>,
          ]}
        />
      </Section>
    </>
  )
}
