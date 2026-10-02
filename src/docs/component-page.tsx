import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"

import { Example, Install, PageHeader, Section } from "./kit"
import { components, demosFor } from "./registry"

export function ComponentPage({ name }: { name: string }) {
  const item = components.find((c) => c.name === name)!
  const demos = demosFor(name)
  return (
    <>
      <PageHeader group="Components" title={item.title} lead={item.description} meta={`@proof/${name}`} />
      <Section title="Installation">
        <Install name={name} />
      </Section>
      {demos.map(({ title, code, Component }) => (
        <Section key={title} title={title}>
          <Example code={code}>
            <Component />
          </Example>
        </Section>
      ))}
      {!demos.length && (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No examples yet</EmptyTitle>
            <EmptyDescription>Add a file under src/docs/demos/{name}/.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </>
  )
}
