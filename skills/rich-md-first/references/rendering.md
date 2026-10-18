# Fit the destination

## Portable defaults

| Destination | Approach |
|---|---|
| Unknown or plain-text viewer | Headings, lists, and concise text; do not depend on rendered extensions |
| GitHub | GFM tables and supported Mermaid syntax; check less common diagram types |
| Terminal / CLI conversation | Concise prose or short lists; keep diagram specifications and alert syntax out of the reading response |
| Current chat with a confirmed renderer | Use formatting and visual tools that the host actually exposes |
| Selected extended editor | Use its verified capabilities; extension support varies by version |

Use fenced `mermaid` blocks when Mermaid is supported. An editor-specific fence
such as `vega-lite` requires explicit support. If a diagram will be read in more
than one environment, provide a short textual explanation of the important rule.

A fenced block is source code, not proof that a diagram is visible. In a CLI,
save a substantial diagram in the chosen document and give the reader its key
point and link. If file writing is unavailable, explain the relationships with
supported text. An explicit request for Mermaid source can still receive code.

For a brief status such as "The document passed review; photos are being
collected; another review follows insertion", report that in a sentence or two.
Turning the same update into a flowchart adds reading work without explaining
additional relationships. Use a table when the reader needs a comparison,
not merely because several facts or file paths exist.

GitHub-compatible alerts put the marker on its own line:

```markdown
> [!WARNING]
> **Payment is required.** Provision only after payment is confirmed.
```

Some editors allow a title after the alert marker. Do not assume that syntax
works in another viewer.

## Unavailable rendering

First complete the reader's task with a readable representation. If a specific
rich source format is required but cannot be verified, keep the artifact and
its readable explanation distinct and state what was not checked. Do not dump
an unrendered specification into a plain-text reading response. Missing tools
in the agent do not establish missing apps for the user.

Do not scan for arbitrary apps or install a renderer to resolve an unknown
preference. An existing user preference can select an available compatible app;
otherwise a file and link are enough when the host supports them.
