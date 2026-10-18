# Validation

The skill is instruction-only. The repository's Node dependencies are used for
development checks, not by the installed skill.

```sh
npm ci --ignore-scripts
npm run check
```

## Automated checks

- Parse SKILL.md frontmatter as YAML; check the required name and description,
  the name's directory match, and metadata limits.
- Resolve local Markdown and HTML links, including the README's linked previews.
- Render each fenced Mermaid example through Pele 1.6.0.
- Compare the deployment table with its data file. Build both main SVG variants
  from the full document example, its owner table, actions, and parsed Mermaid
  nodes and transitions to detect drift. Rebuild the two separate document
  previews from the same sources.
- Check installed instructions for accidental personal filesystem paths.

Generated SVGs and a machine-readable result are written to `.checks/`.
Rebuild the main illustrations with `node scripts/build-hero.mjs`.

Pele syntax checks do not prove that every diagram renders in GitHub or in
every editor. Rendering support depends on the destination and version.
The workflow is provided in `.github/workflows/check.yml`; a local successful
run does not mean that GitHub Actions has already run on a remote repository.

## Installation and behavior

Use a temporary project to verify package discovery and installation with the
Skills CLI. Confirm that SKILL.md and its three references arrive intact in
the target agent directories. This checks the installation route, not an
agent's automatic activation or answer quality.

The checked-in examples expose the inputs and expected structure for review:

- Full document: one shared brief, a 454-word plain reply, and a structured
  rollout review with navigation, callouts, tables, a workflow, and actions.
- Comparison: the same setup, data-location, and maintenance facts for all options.
- Workflow: validation and payment gate provisioning; both failures retain a reason.
- Monthly counts: unrelated events do not establish cohort conversion or a flow.

For behavioral evaluation in a host, also try a short factual answer, an
unknown viewer, an explicit viewer choice, a process with AND requirements
and bounded retries, and an optional-viewer request. Inspect the output against
the source. These scenarios are evaluation guidance, not a claim that every
host or model has passed a benchmark.

Terminal regression scenarios:

- A brief progress update: report the result and next step without a diagram,
  boxed table, alert marker, or announcement that the skill is being followed.
- A substantial explanation in a plain-text interface: keep the response readable
  and put rich source in an appropriate artifact when file writing is available.
- An explicit request for Mermaid source: provide the requested code.
- A comparison intended for GitHub: retain the supported Markdown table.
- A simple linear procedure: use a short list rather than a flowchart.
- A branching process for a confirmed diagram renderer: use a useful visual
  and preserve its conditions rather than suppressing every diagram.

Evaluate actual generated answers, including brevity, preserved facts, and
whether the destination can render the selected form. Syntax checks alone do
not test these behaviors, and a few successful runs do not establish reliability
across all models or sessions.

## Installation documentation

- [Agent Skills specification](https://agentskills.io/specification)
- [Skills CLI](https://www.skills.sh/docs/cli)
- [Codex skill locations](https://learn.chatgpt.com/docs/build-skills)
- [Claude Code skills](https://code.claude.com/docs/en/skills)

## Visual review

The README shows two linked page miniatures side by side. Their purpose is to
show the difference in structure; click either image to inspect it at full size.
Links to the complete examples and brief sit in a collapsed details block.
Both illustrated workflows preserve the same nodes, conditions, and transitions.
Verify the rendered page at desktop and narrow widths when changing the visuals:
the previews should stay compact, the links should open full-size assets, and
the details block should start collapsed.
