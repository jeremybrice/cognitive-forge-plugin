---
description: Capture a knowledge checkpoint from the current conversation to a local markdown file.
---

# /checkpoint Command

## Behavior

### 1. Extract from conversation
Summarize key information, decisions, context, and current understanding from the conversation. Focus on:
- What was discussed and concluded
- Key decisions made (even if not formally logged)
- Current state of understanding on the topic
- Important context that should persist beyond this session

### 2. Classify

Infer classifications from conversation context. Prompt only for values that cannot be inferred.

**Domain** (select one):
- Integration
- Operations
- Configuration
- Reporting
- Mobile
- Feature Scope
- Architecture
- Requirements
- Technical Spec
- Stakeholder Context

**Product** (select one):
Read from `memory/context/products.md` YAML frontmatter `products` key. If no config exists, accept freeform value and suggest `/productivity:setup-org`.

**Module** (select one):
Read from `memory/context/products.md` YAML frontmatter `modules` key. If no config exists, accept freeform value.

**Client** (select one):
Read from `memory/context/clients.md` YAML frontmatter `clients` key. If no config exists, accept freeform value.

### 3. Write to local file

**Target directory:** `cards/checkpoints/`

**Filename convention:** `checkpoint-YYYY-MM-DD-{slug}.md` where the slug is derived from the checkpoint title.

**YAML Frontmatter:**
```yaml
---
title: "[Descriptive title of what was captured]"
type: checkpoint
checkpoint_date: YYYY-MM-DD
product: "[select]"
module: "[select]"
client: "[select]"
domain: "[select from Domain list above]"
status: Current
source_conversation: "[Conversation title or context identifier]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**Card body content:**

Structure the checkpoint with `##` headings and blank lines between sections:

```markdown
## Summary

[Concise overview of what this checkpoint captures]

## Key Points

- [Point 1]
- [Point 2]
- [Point 3]

## Decisions & Conclusions

[Any decisions or conclusions reached during the conversation]

## Open Items

- [Any unresolved items or next steps]

## Context

[Additional context that would help someone picking this up later understand the full picture]
```

### 4. After save

Display only: `Checkpoint saved to cards/checkpoints/{filename}.md`

## Key Behaviors

- **Automatic save:** Save automatically after generating the checkpoint (no separate approval needed since the user explicitly invoked /checkpoint)
- **Topic focus:** If the user provides a topic focus with the command (e.g., `/checkpoint notification service architecture review`), focus the checkpoint on that topic
- **Default behavior:** If no focus provided, capture the overall conversation state
- **Always include:** source_conversation field in frontmatter
- **Formatting:** Always use blank lines between sections in card body; use `##` headings
- **No `<empty-block/>` tags:** Use blank lines for spacing instead
