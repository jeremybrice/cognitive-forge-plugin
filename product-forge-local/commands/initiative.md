---
description: Generate, update, or review Initiative cards (top-level scope definition and estimation for leadership).
---

# Initiative Command

## Mode Routing

Determine the mode from the user's input:
- "create", "generate", "new", or no mode specified with new context → **Create Mode**
- "update", "revise", "modify", or references an existing card with new information → **Update Mode**
- "review", "assess", "evaluate", or asks for feedback on an existing card → **Review Mode**

If the user says "update" or "review" without specifying a card, ask them to identify which card to work with (by title, filename, or search).

Review mode assesses the card on its own merits. See Review Mode section below.

---

## Create Mode

### Overview

When the user invokes `/initiative create` or `/initiative` with context suggesting creation, this command gathers context and generates a structured Initiative card for leadership review.

### Process

#### 1. Gather Context

Accept input from one of these sources:
- An approved intake output (if invoked after `/intake`)
- Conversation context from the current session
- Direct user prompt describing the Initiative

If invoked after `/intake`, use the intake summary as the primary source for initiative details.

#### 2. Read the Initiative Template

Fetch the template from `skills/pm-methodology/templates/initiative-template.md` to understand required sections and formatting standards.

#### 3. Generate the Initiative Card

Create a structured Initiative card with the following sections:

**Background**: 2–3 prose paragraphs describing the current state and the problem. Include market context, user pain points, or business drivers that make this Initiative relevant now. Address: What problem are we solving? Why is this a priority?

Do not use bullets in this section. Prose allows for narrative flow that helps leadership understand strategic fit.

**Proposed Solution**: 2–3 prose paragraphs describing the high-level solution. What are we building? How does it solve the problem? Keep language business-focused and avoid deep technical details unless necessary for estimation.

This section should be understandable to non-technical stakeholders. Technical specifics belong in child Epics and Stories.

**Affected Systems**: Bullet list using system names from `memory/context/products.md` YAML frontmatter `systems` key. If no config exists, use freeform system names. Include both primary systems (where the main work happens) and secondary systems (integrations or dependencies).

**Potential Requirements**: Bullet list of 4–6 high-level capabilities that need to be built. These are not implementation specs but enough detail for engineering to estimate effort. Each bullet should be substantive (1–2 sentences minimum) and describe a distinct capability.

**Additional Considerations**: Bullet list of cross-cutting concerns, migration needs, backward compatibility requirements, or client-specific constraints. Anything that affects estimation or feasibility.

**Open Questions**: Bullet list of unknowns or decisions that haven't been made. Engineering will need answers to these for detailed estimation.

**Out of Scope** (optional): Bullet list of explicitly excluded items to prevent scope creep. Include this section if there are items that might reasonably be assumed as part of the Initiative but are intentionally excluded.

#### 4. Present to User for Confirmation

Display the generated Initiative card to the user. Ask for confirmation before proceeding to save.

Provide an opportunity for the user to request revisions or modifications.

#### 5. Save to Local File

On user approval, save the Initiative card as a markdown file.

**Target directory:** `cards/initiatives/`

**Filename:** Generated from the Initiative title in kebab-case (e.g., `notification-system-overhaul.md`)

**YAML Frontmatter:**
```yaml
---
title: "[Initiative Title]"
type: initiative
status: Draft
product: "[From taxonomy]"
module: "[From taxonomy]"
client: "[From taxonomy]"
team: "[Team name]"
confidence: "[Low | Medium | High, if available]"
estimate_hours: null
jira_card: null
source_intake: "[intake filename without .md, if from intake]"
children: []
description: "[Background + Proposed Solution condensed to 2-3 sentences]"
source_conversation: "[Conversation title or context]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**Card body:** Full Initiative card content with blank lines between major sections (Background, Proposed Solution, Affected Systems, Potential Requirements, Additional Considerations, Open Questions, Out of Scope if applicable). Use `##` headings for each section.

#### 6. After Save

Display only: `Initiative saved to cards/initiatives/{filename}.md`

Do not include additional commentary or action items. Let the user decide next steps.

#### 7. Relation Linking

If the Initiative was created from an intake document:
1. Read the intake file from `cards/intakes/`
2. Add this Initiative's filename (without `.md`) to the intake's `generated_initiatives` array
3. Update the intake's `updated` date to today
4. Write the updated intake file back

### Formatting Rules (CRITICAL)

- Never use dashes to separate thoughts. Dashes only appear in compound words or hyphenated terms.
- Never use tables. Use prose and bullets only.
- Prose for Background and Proposed Solution sections. Bullets for lists (Affected Systems, Potential Requirements, Additional Considerations, Open Questions, Out of Scope).
- Use blank lines between major sections in the card body.

### Example Workflow

**User input:**
```
/initiative create
Build a real-time driver allocation system that dynamically assigns routes and stops based on real-time traffic, driver availability, and vehicle capacity.
```

**Command**:
1. Reads the Initiative template for structure
2. Gathers context from user input
3. Generates a complete Initiative card with all sections
4. Presents the card to the user for review and approval
5. On approval, saves to `cards/initiatives/` with populated frontmatter
6. Returns: `Initiative saved to cards/initiatives/real-time-driver-allocation.md`

---

## Update Mode

Update mode modifies an existing card with new context. It is a single-agent flow with mandatory user approval before writing back.

### Workflow

**Step 1: Identify the card**
Accept a card reference from the user: a filename, a card title, or enough context to search for it. Read the existing card from `cards/initiatives/`.

**Step 2: Accept new context**
The user provides new information as freeform input. This could be:
- Pasted meeting notes
- Verbal summary of what changed
- Engineer feedback on feasibility or estimates
- Changed requirements from stakeholders
- Revised scope or timeline

No structured format required. Accept whatever the user provides naturally.

**Step 3: Semantic comparison**
Compare the new context against the existing card sections. Identify:
- Which sections need changes (modifications, additions)
- Which sections should be left completely untouched
- Whether any new sections need to be added

Do NOT rewrite the entire card. Only modify what the new context affects.

**Step 4: Present the diff**
Show the user what will change:
- For each modified section, show the original and the proposed update
- Clearly indicate additions, modifications, and removals
- Leave unchanged sections out of the diff (mention they are unchanged)

Example format:
```
**Changes to [Card Title]:**

**Estimate Hours:** 80 → 120
**Rationale:** [Added based on engineering feedback]

**Background:** No changes.

**Proposed Solution:**
- Added: "Integration with payment gateway requires a dedicated adapter layer"
- Modified: Timeline reference updated from Q3 to Q4

**Open Questions:**
- Removed: "Is the payment API stable?" (answered: yes, v3.0 is stable)
- Added: "Should the adapter support batch processing?"

All other sections unchanged.
```

**Step 5: Get approval**
Ask the user to confirm or adjust the proposed changes.

CRITICAL: Never silently overwrite a card. The approval step is mandatory. This is especially important for Initiatives that leadership may have already reviewed.

**Step 6: Write back**
On approval, update the markdown file:
1. Parse the existing frontmatter and body
2. Apply the approved changes to the affected sections and properties
3. Update the `updated` date in frontmatter to today
4. Write the complete file back to `cards/initiatives/{filename}.md`

Only update the properties and sections that actually changed.

---

## Review Mode

Review mode reads an existing Initiative and provides a quality assessment. It does NOT automatically compare against other Initiatives.

### Workflow

**Step 1: Identify the card**
Accept a card reference: filename, title, or search context. Read the existing Initiative from `cards/initiatives/`.

**Step 2: Assess on its own merits**
Evaluate the Initiative against these criteria:

**Scope Clarity**
- Are the scope boundaries clearly defined?
- Is it clear what is in scope and what is out of scope?
- Could a reader unfamiliar with the project understand the boundaries?

**Estimate Reasonableness**
- Is the effort estimate present and specific enough to be useful?
- Does the confidence level match the level of detail provided?
- Are there unresolved questions that would significantly change the estimate?

**Business Justification**
- Is the "why" clear? Would leadership understand the value proposition?
- Is the problem statement specific enough to evaluate priority?
- Does the proposed solution clearly address the stated problem?

**Completeness**
- Are all required sections present and substantive?
- Are affected systems identified?
- Are open questions documented (not hidden)?
- Is the out-of-scope section present if there are common misconceptions about what's included?

**Actionability**
- Could this Initiative be handed to a team lead to begin Epic planning?
- Are there blocking questions that must be answered before work can begin?

**Step 3: Present the assessment**
Provide a structured assessment covering each criterion. For each:
- Rate as Strong, Adequate, or Needs Attention
- Provide specific observations (quote from the card where relevant)
- Suggest improvements where applicable

**Step 4: Cross-card comparison (only if user-requested)**
If the user explicitly references another card (e.g., "compare this against the notification system initiative"), read the referenced card from `cards/initiatives/` and perform a targeted comparison. Never proactively search for "similar" cards.

---

## Notes

- Initiatives are top-level scope cards for leadership and key stakeholders. They should be readable in 5 minutes.
- If the Initiative requires more detail or is too large, recommend breaking it into multiple Initiatives or deferring specifics to child Epics.
- The Open Questions section should identify blockers or decisions needed before estimation can proceed.
