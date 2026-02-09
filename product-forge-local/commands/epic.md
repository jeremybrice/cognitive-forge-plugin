---
description: Generate, update, or review Epic cards (team-level feature container under an Initiative).
---

# Epic Command

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

When the user invokes `/epic create` or `/epic` with context suggesting creation, this command gathers context and generates a structured Epic card for team-level planning and story breakdown.

### Process

#### 1. Gather Context

Accept input from one of these sources:
- An approved intake output
- An existing Initiative card
- Conversation context from the current session
- Direct user prompt describing the Epic

Determine the parent Initiative if available, as Epic scope must align with Initiative goals.

#### 2. Read the Epic Template

Fetch the template from `skills/pm-methodology/templates/epic-template.md` to understand required sections and formatting standards.

#### 3. Generate the Epic Card

Create a structured Epic card with the following sections:

**Background/Context**: 1–2 prose paragraphs explaining why this Epic exists. Link it to the parent Initiative. Describe the business value and how it fits into the larger product roadmap. An engineer reading this should understand the "why" without needing to reference the Initiative.

**Epic Scope**: 1–2 prose paragraphs defining the exact capability being delivered. Be precise about boundaries. What's included? What's deferred? This section answers: "What will the system be able to do when this Epic is complete?"

Do not use bullets. Prose supports clear boundary definition.

**Affected Systems**: Bullet list of systems touched by this Epic using system names from `memory/context/products.md` YAML frontmatter `systems` key. If no config exists, use freeform system names. Include both primary systems (where main work happens) and secondary systems (integrations or dependencies).

**Functional Capabilities**: Bullet list of discrete capabilities the system will have upon completion. Each capability should be observable and testable. 1–2 sentences per bullet.

**Suggested Story Breakdown**: Bullet list of candidate Stories that will decompose this Epic. Each bullet is a potential Story card with a brief description. Use this to communicate the breakdown and identify dependencies or sequencing needs.

**Success Criteria**: Bullet list of observable outcomes that indicate the Epic is complete and working. These are not detailed acceptance tests but high-level success measures.

**Related Epics/Dependencies**: Bullet list of other Epics this depends on or relates to. Include sequencing constraints (e.g., "Depends on:", "Blocks:", "Related:").

**Technical Constraints**: Bullet list of known technical limitations or requirements that affect design. Write these as constraints, not solutions.

**Open Questions**: Bullet list of decisions not yet made that will affect Story creation. Engineering and product should resolve these before Stories are written.

**Out of Scope** (optional): Bullet list of items explicitly excluded from this Epic. Use this to prevent scope creep and clarify what belongs in future Epics.

#### 4. Present to User for Confirmation

Display the generated Epic card to the user. Ask for confirmation before proceeding to save.

Provide an opportunity for the user to request revisions or modifications.

#### 5. Save to Local File

On user approval, save the Epic card as a markdown file.

**Target directory:** `cards/epics/`

**Filename:** Generated from the Epic title in kebab-case (e.g., `email-notification-engine.md`)

**YAML Frontmatter:**
```yaml
---
title: "[Epic Title]"
type: epic
status: Planning
product: "[From taxonomy]"
module: "[From taxonomy]"
client: "[From taxonomy]"
team: "[Team name]"
parent: "[parent Initiative filename without .md]"
children: []
description: "[Epic Scope condensed to 2-3 sentences]"
source_intake: "[intake filename without .md, if applicable]"
source_conversation: "[Conversation title or context]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**Card body:** Full Epic card content with blank lines between major sections. Use `##` headings for each section.

#### 6. After Save

Display only: `Epic saved to cards/epics/{filename}.md`

Do not include additional commentary or action items. Let the user decide next steps.

#### 7. Relation Linking

After saving the Epic, update related cards:

- **Parent Initiative:** Read the parent Initiative file from `cards/initiatives/`, add this Epic's filename to the Initiative's `children` array, and update the Initiative's `updated` date. Write the updated Initiative file back.
- **Source Intake (if applicable):** Read the intake file from `cards/intakes/`, add this Epic's filename to the intake's `generated_epics` array, and update the intake's `updated` date. Write the updated intake file back.

### Formatting Rules (CRITICAL)

- Never use dashes to separate thoughts. Dashes only appear in compound words or hyphenated terms.
- Never use tables. Use prose and bullets only.
- Prose for Background/Context and Epic Scope sections. Bullets for all list sections.
- Use blank lines between major sections in the card body.

### Example Workflow

**User input:**
```
/epic create
Parent Initiative: Real-Time Route Optimization Engine
Epic: Build the forecasting engine that predicts demand patterns to inform route decisions
```

**Command**:
1. Reads the Epic template for structure
2. Gathers context from user input and identifies the parent Initiative
3. Generates a complete Epic card with all sections
4. Presents the card to the user for review and approval
5. On approval, saves to `cards/epics/` with populated frontmatter and updates the parent Initiative's `children` array
6. Returns: `Epic saved to cards/epics/demand-forecasting-engine.md`

---

## Update Mode

Update mode modifies an existing card with new context. It is a single-agent flow with mandatory user approval before writing back.

### Workflow

**Step 1: Identify the card**
Accept a card reference from the user: a filename, a card title, or enough context to search for it. Read the existing card from `cards/epics/`.

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

CRITICAL: Never silently overwrite a card. The approval step is mandatory. This is especially important for Epics that may have stories already in progress.

**Step 6: Write back**
On approval, update the markdown file:
1. Parse the existing frontmatter and body
2. Apply the approved changes to the affected sections and properties
3. Update the `updated` date in frontmatter to today
4. Write the complete file back to `cards/epics/{filename}.md`

Only update the properties and sections that actually changed.

---

## Review Mode

Review mode reads an existing Epic and provides a quality assessment. It does NOT automatically compare against other Epics.

### Workflow

**Step 1: Identify the card**
Accept a card reference. Read the existing Epic from `cards/epics/`.

**Step 2: Assess on its own merits**
Evaluate the Epic against these criteria:

**Story Coverage**
- Does the suggested story breakdown cover the full scope of the Epic?
- Are there obvious gaps where stories are missing?
- Are the stories at the right granularity (not too large, not too small)?

**Scope Consistency**
- Is the Epic scope consistent with its parent Initiative (if linked)?
- Does the Epic scope stay within its stated boundaries?
- Are there scope items that belong in a different Epic?

**Acceptance Criteria Clarity**
- Are success criteria specific and observable?
- Could a PM determine when this Epic is "done" based on the criteria?
- Are there implicit expectations not captured in the criteria?

**Completeness**
- Are all required sections present and substantive?
- Are affected systems identified?
- Are technical constraints documented?
- Are dependencies on other Epics or external factors captured?

**Actionability**
- Could an engineering team lead use this Epic to plan a sprint?
- Are there blocking questions that must be resolved first?
- Is the story breakdown detailed enough to begin story writing?

**Step 3: Present the assessment**
Structured assessment with ratings (Strong, Adequate, Needs Attention) per criterion, specific observations, and improvement suggestions.

**Step 4: Cross-card comparison (only if user-requested)**
Only when the user explicitly names another card. Never proactively search.

---

## Notes

- Epics are team-level scope cards. They should be readable and understandable in 10 minutes.
- The Suggested Story Breakdown is critical for epic planning. It should be detailed enough for the team to estimate total effort.
- Open Questions must be resolved before Stories are written. Flag any blockers or decisions needed.
- Epics should have a clear parent Initiative. If they don't, consider whether this Epic belongs in a different Initiative or needs its own Initiative.
