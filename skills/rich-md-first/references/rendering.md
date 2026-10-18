# Fit the destination

## Portable defaults

| Destination | Approach |
|---|---|
| Unknown or plain-text viewer | Headings, lists, and concise text; do not depend on rendered extensions |
| GitHub | GFM tables and supported Mermaid syntax; check less common diagram types |
| Current chat | Use formatting and visual tools that the host actually exposes |
| Selected extended editor | Use its verified capabilities; extension support varies by version |

Use fenced `mermaid` blocks when Mermaid is supported. An editor-specific fence
such as `vega-lite` requires explicit support. If a diagram will be read in more
than one environment, provide a short textual explanation of the important rule.

GitHub-compatible alerts put the marker on its own line:

```markdown
> [!WARNING]
> **Payment is required.** Provision only after payment is confirmed.
```

Some editors allow a title after the alert marker. Do not assume that syntax
works in another viewer.

## Unavailable rendering

First complete the reader's task with a readable representation. If a specific
rich format is required but cannot be verified, state that its rendering is
unverified. Missing tools in the agent do not establish missing apps for the user.

Do not scan for arbitrary apps or install a renderer to resolve an unknown
preference. An existing user preference can select an available compatible app;
otherwise a file and link are enough when the host supports them.
