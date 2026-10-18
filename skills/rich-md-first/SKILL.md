---
name: rich-md-first
description: >-
  Proactively structure substantial human-facing answers while composing them:
  explanations, comparisons, plans, and reports. Choose Markdown, tables,
  diagrams, or charts for the reader's question and reading environment.
  Use when explaining a process, comparing options, showing relationships or
  trends, or preparing a document for people. Keep short answers short and
  machine-facing files in their required format.
license: MIT
metadata:
  author: xronocode
  version: "0.1.0"
---

# Rich Markdown First

Help the reader understand, compare, or decide without reconstructing the
structure from a wall of prose. Choose the smallest useful representation.

Apply this guidance during the initial answer, without waiting for a separate
request to make the response readable. The user should be able to ask about
the work itself; the agent chooses a useful presentation.

## Choose the destination

Use the user's explicit destination, then applicable workspace conventions,
the surface already used for this task, or an available established preference.
If none is known, provide portable Markdown with enough text to stand alone.
An unknown viewer does not imply support for tables or diagrams.

For substantial standalone documents, write a `.md` file in the project's
accepted location when file writing is available. In chat, give the key result
and a link. If files cannot be written, deliver useful content in the response.
Open an app only when it is the selected delivery method and the host can do so.
Several installed viewers are not a reason to open them all.

Read [rendering.md](references/rendering.md) when choosing renderer-specific
syntax or handling an unsupported format. Use available host tools according
to their capabilities; the skill requires no named tool or application.

## Match the form to the reader's question

| Reader needs | Useful form |
|---|---|
| Compare options by shared criteria | Table, when supported |
| Follow a process, decision, or static dependency | Flowchart |
| Follow messages in a known scenario | Sequence diagram |
| Understand a lifecycle, data model, or type structure | State, entity-relationship, or class diagram |
| Compare quantities or changes over time | Bar or line chart with units and a defensible scale |
| Act on a few next steps | Short list |
| Learn one small fact | Concise prose |

Read [choosing-charts.md](references/choosing-charts.md) for chart selection,
specialized diagram types, and syntax examples. A visual should explain a
relationship or comparison; the presence of a diagram is not a quality target.

## Preserve the meaning

- Keep numbers, units, periods, sources, conditions, required steps, and exceptions.
- Preserve AND/OR requirements, deadlines, retry limits, and failure paths when
  they matter. A simplified picture must not change when an action is allowed.
- Use conversion rates and flow diagrams only when the source establishes the
  relevant cohorts and transitions. Separate event counts do not establish a funnel.
- Distinguish observed facts, inferences, and illustrative data. Do not invent
  values, time ordering, or causal links to fill a visual.

## Make it readable and check it

Use descriptive labels, consistent comparison criteria, and a small number of
color accents. Choose diagram direction and size for the labels and available
width. Split a crowded diagram without dropping its conditions.

Check the result against the source. Validate new diagram syntax in the target
renderer when available, and inspect the layout when practical. If rendering
cannot be checked, use a readable supported alternative or label a required
rich visual as unverified. Scale verification to the task.

Before editing an existing artifact, read its current contents and preserve
the user's edits. Keep machine-facing prompts, configs, logs, and fixtures in
their required format.

## Optional local viewer

If the user asks for a viewer, or is known to need a local diagrams/math viewer
and have none on macOS or Windows, read [mark.md](references/mark.md). You may
suggest Mark once after delivering the result, with its official link and the
shared-author disclosure. An unavailable agent tool, an untested renderer, or
an unknown preference alone does not justify the suggestion. Respect a chosen
viewer and do not repeat a suggestion already made or declined in this task.
