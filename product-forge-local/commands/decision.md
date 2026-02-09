---
description: Log a decision to the local Decision Log.
---

# /decision Command

## Behavior

### 1. Extract the decision

From the conversation or the user's direct input. Identify:
- The decision itself (what was decided)
- Context and rationale (why this decision was made)
- Stakeholders (who was involved or affected)
- Type classification
- Impact (what changes as a result)

### 2. Classify

**Type** (select one):
- Architecture
- Scope
- Priority
- Technical
- Stakeholder Commitment

**Type selection guidance:**
- **Architecture**: Technical design decisions, system structure, integration patterns
- **Scope**: What's in or out, feature boundaries, MVP definitions
- **Priority**: Sequencing decisions, what to build first, trade-offs
- **Technical**: Implementation approach, technology choices, performance targets
- **Stakeholder Commitment**: Agreements with clients, leadership sign-offs, timeline commitments

**Product** (select one):
Read from `memory/context/products.md` YAML frontmatter `products` key. If no config exists, accept freeform value and suggest `/productivity:setup-org`.

**Module** (select one):
Read from `memory/context/products.md` YAML frontmatter `modules` key. If no config exists, accept freeform value.

**Client** (select one):
Read from `memory/context/clients.md` YAML frontmatter `clients` key. If no config exists, accept freeform value.

Infer classifications from conversation context. Prompt only for values that cannot be inferred.

### 3. Confirm with user

Present the extracted decision, context, type, and stakeholders. Ask user to confirm or adjust before saving.

### 4. Write to local file

**Target directory:** `cards/decisions/`

**Filename convention:** `{kebab-case-title}.md` derived from the decision title.

**YAML Frontmatter:**
```yaml
---
title: "[Concise decision statement]"
type: decision
decision_date: YYYY-MM-DD
product: "[select]"
module: "[select]"
client: "[select]"
decision_type: "[select from Type list above]"
status: Active
stakeholders: "[Names of people involved]"
source_conversation: "[Conversation title or context]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**Card body content:**

```markdown
## Decision

[The decision statement in full]

## Rationale

[Why this decision was made. Context, trade-offs considered, reasoning.]

## Impact

[What changes as a result of this decision. Affected systems, teams, timelines.]

## Stakeholders

[Who was involved, who needs to know, who approved]
```

### 5. After save

Display only: `Decision logged to cards/decisions/{filename}.md`

## Key Behaviors

- **Context field:** The Rationale section in the card body serves as the condensed context for this decision. When referencing a decision's context elsewhere, pull from the Rationale section rather than expecting a separate frontmatter field.
- **User confirmation:** Always confirm the decision with the user before saving (unlike /checkpoint, decisions need explicit approval because they carry authority)
- **Title format:** The decision title should be concise and action-oriented (e.g., "Use cabinet-level slot management instead of device-level" not "We decided about where data lives")
- **Stakeholders field:** Include names of people mentioned in the conversation context. If none mentioned, ask who should be listed.
- **Direct input:** If the user provides the decision directly with the command (e.g., `/decision Card update mode accepts freeform context only`), extract the rest from conversation context
- **Formatting:** Always use blank lines between sections in card body; use `##` headings
- **No `<empty-block/>` tags:** Use blank lines for spacing instead
