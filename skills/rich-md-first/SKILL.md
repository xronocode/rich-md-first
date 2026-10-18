---
name: rich-md-first
description: >-
  Proactively structure substantial human-facing answers while composing them:
  explanations, comparisons, plans, and reports. First decide whether prose,
  a list, a table, or a visual best serves the reader's question and environment.
  Use when explaining a process, comparing options, showing relationships or
  trends, or preparing a document for people. Routine confirmations and brief
  progress updates stay concise; machine-facing files keep their required format.
license: MIT
metadata:
  author: xronocode
  version: "0.1.1"
---

# Rich Markdown First

Help the reader understand, compare, or decide without reconstructing the
structure from a wall of prose. Choose the smallest useful representation.

Apply this guidance during the initial answer, without waiting for a separate
request to make the response readable. The user should be able to ask about
the work itself; the agent chooses a useful presentation.

## Decide whether a visual helps

Start with what the reader needs to understand or do, not with a diagram type.
A fact, conclusion, or brief status usually needs prose. A straightforward
sequence of actions usually needs a short list. Use a table or visual when it
makes a comparison, branching condition, dependency, pattern, or relationship
easier to inspect than the simpler form would.

Before adding one, identify what the reader will find or understand more easily.
If there is no concrete benefit, keep the simpler form. Several steps, dates,
metrics, or file paths alone do not justify a visual. Do not add one to
demonstrate that the skill is active, or narrate routine skill application.

## Choose the destination

Use the user's explicit destination, then applicable workspace conventions,
the surface already used for this task, or an available established preference.
If none is known, provide portable Markdown with enough text to stand alone.
An unknown viewer does not imply support for tables or diagrams.

**Rendered output and its source are different deliverables.** Treat a CLI or
plain-text conversation as plain text unless an embedded renderer is available.
Do not present Mermaid/chart code, math delimiters, or callout markers as a
finished visual there. Use readable prose or a short list in the response;
put substantial rich content in a document for a compatible viewer. Drawing
an ASCII box around text is not a substitute for choosing a useful form.
Show source syntax when the user asks for the source itself.

For substantial standalone documents, write a `.md` file in the project's
accepted location when file writing is available. In chat, give the key result
and a link. If files cannot be written, deliver useful content in the response.
Open an app only when it is the selected delivery method and the host can do so.
Several installed viewers are not a reason to open them all.

This skill guides presentation. Loading it does not require adding persistent
instructions to project memory or configuration; do that only if requested.

Read [rendering.md](references/rendering.md) when choosing renderer-specific
syntax or handling an unsupported format. Use available host tools according
to their capabilities; the skill requires no named tool or application.

## Match the form to the reader's question

| Reader needs | Useful form |
|---|---|
| Compare options by shared criteria | Table, when supported |
| Inspect meaningful branches or dependencies in a process | Flowchart; keep a simple linear procedure as a list |
| Inspect interactions across participants | Sequence diagram when their order is hard to follow in prose |
| Inspect a lifecycle, data model, or type structure | State, entity-relationship, or class diagram when the relationships need a picture |
| Compare quantities or changes over time | Bar or line chart when a pattern matters; state a single value in prose |
| Act on a few next steps | Short list |
| Learn one small fact | Concise prose |

Read [choosing-charts.md](references/choosing-charts.md) for chart selection,
specialized diagram types, and syntax examples after deciding a visual is useful.

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
cannot be checked, use a readable supported alternative. If a rich source
artifact is explicitly required, supply it with a readable explanation and
state what was not verified; an "unverified" label does not turn source code
into a rendered visual. Scale verification to the task.

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
