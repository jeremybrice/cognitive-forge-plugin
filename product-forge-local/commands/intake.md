---
description: Structured interview for gathering product requirements. Produces an intake summary with a manifest for downstream card generation.
---

# /intake Command

## Overview

The `/intake` command conducts an adaptive Q&A interview covering seven topic areas to gather comprehensive product requirements. It produces a standardized intake summary, persists it as a local markdown file, and prepares a manifest for sub-agent card generation.

## Command Flow

### Phase 1: Initial Assessment & Adaptive Planning

Before asking questions, assess what the user has already provided:
- Screenshots, mockups, or design artifacts
- Existing documents or requirements
- Verbal summary or problem statement
- Answers to previous questions
- Context from referenced features or systems

**Skip questions where answers are evident from provided context.** This prevents redundant questioning and respects the user's time.

### Phase 2: Guided Interview (Adaptive Q&A)

Conduct the interview across seven topic areas, adapting depth based on context provided. Use question batching to maintain conversational flow.

#### Topic 1: Problem & Driver

Cover the core motivation and impact:
- What's broken or missing today?
- What happens downstream as a result?
- Who is affected? (drivers, operators, customers, internal teams, support staff)
- What's driving this request? (client request, internal feedback, operational issue, integration requirement, bug fix)
- Is this tied to a specific client or account?

**Question Batching Example:**
"Let me start by understanding the problem. What's currently broken or missing that prompted this request? And who's most affected by this—is it field operators, customers, or an internal team?"

#### Topic 2: Scope Boundaries

Define what's in and out of scope:
- What systems are explicitly in scope? (asset types, user types, workflows)
- What's explicitly out of scope?
- Does this apply to all machines/markets/locations or a specific subset?
- Which user roles are affected or excluded?
- Are there phase 2 / future considerations to note as explicitly out of scope?

**Question Batching Example:**
"Now let's define the scope. Should this work for all customer markets, or are we starting with a specific region? And are there particular user roles—like route drivers vs. warehouse managers—that should or shouldn't see this?"

#### Topic 3: Solution Details

Understand the interaction design and UI placement:
- Where does this live in the product? (screen, modal, settings page, app, report)
- What's the user workflow or interaction pattern?
- Are there existing UI patterns to follow or system conventions?
- What should the user see/experience when the task is complete?
- If screenshots are provided: "I see [element]. Should the new feature follow this same pattern?"

**Question Batching Example:**
"Where would this feature live? And walk me through what the user would do—step by step. When they're done, what confirms success?"

#### Topic 4: Defaults & Behaviors

Pin down the operational details:
- For settings/toggles: default state, who can change it, label/name
- For new fields: default value, required or optional, allowed values/constraints
- For visibility: when shown vs. hidden, what happens to the value if hidden
- For new behavior: expected behavior in both states, edge cases, error handling
- Should this behavior differ by user role or context?

**Question Batching Example:**
"If we add a toggle for this, should it be on or off by default? And who should be able to change it—just admins, or any user? What about edge cases—what happens if the user tries X while the toggle is off?"

#### Topic 5: Technical Considerations

Map system dependencies and constraints:
- Which systems are involved? Read systems from your configured taxonomy in `memory/context/products.md`
- Known constraints or dependencies?
- Backward compatibility requirements? (older app versions, legacy data, existing schemas)
- Is this one team's work or cross-team effort?
- For integrations: target system, single-system vs. integration layer changes, sync timing
- For data changes: what happens to existing data, migration needed, data model impact

**Question Batching Example:**
"Which systems does this touch? And are there compatibility concerns with older versions in the field we need to account for?"

#### Topic 6: Open Questions

Document unknowns and engineering decisions:
- What's unclear to the user?
- What decisions should engineering make (vs. product)?
- What are the unknowns worth documenting?
- Common engineering-decides items: data model design, copy vs. move logic, caching strategy, API contract details, performance optimization approach, error handling specifics

**Question Batching Example:**
"Before we wrap up, are there any decisions you think engineering should own? Or anything you're unsure about that should be in this intake?"

#### Topic 7: Card Type / Manifest

Determine what downstream cards to generate:
- **Initiative**: for leadership estimation and strategic roadmap alignment
- **Epic**: for scope definition with story breakdown; typically 2–4 week effort
- **Story**: for specific, implementable work; typically 1–3 day effort
- **Combination**: multiple card types for large/complex features

Ask: "What card type(s) should we generate from this intake? Are you looking for an Epic that breaks down into Stories, or just Stories directly?"

### Phase 3: Red Flag Probing

Watch for these phrases and probe deeper:

| Red Flag | Probe |
|----------|-------|
| "It should work like it does today" | Clarify what "today" means—which version? Which user type? Get specifics. |
| "Just add a simple toggle" | Toggles are rarely simple. Get defaults, behaviors, who can change it, what breaks if flipped. |
| "This is similar to [other feature]" | Confirm which aspects are similar. Don't assume; ask for specifics. |
| "We'll handle that later" | Capture it as an Open Question; note it's out of scope for phase 1. |
| No mention of existing data | Ask about migration, backward compatibility, and what happens to legacy records. |
| "Everyone needs this" | Narrow the scope. Which roles first? Which systems? Which markets? |

### Phase 4: Confirmation Step

**Never skip this step.** After gathering sufficient information, state your understanding back:

```
Let me confirm what I'm hearing:

**The Problem:** [1-2 sentence summary]

**The Solution:** [1-2 sentence summary of what we're building]

**In Scope:** [bullet list]

**Out of Scope:** [bullet list]

**Technical Notes:** [key dependencies, constraints]

**Card Types:** [manifest]

Does this match your understanding? Any corrections or additions?
```

Wait for user confirmation before proceeding to save.

### Phase 5: Intake Summary Creation

Once confirmed, structure the intake using the template below. Use blank lines between sections for proper formatting.

```markdown
# Intake Summary

## Problem Statement

[Problem description in prose format. 2-3 sentences explaining what's broken/missing, who's affected, and downstream impact.]

## Proposed Solution

[Solution description in prose format. 2-3 sentences describing what we're building, where it lives, and how it addresses the problem.]

## In Scope

- [Scope item 1]
- [Scope item 2]
- [Scope item 3]

## Out of Scope

- [Exclusion 1 with context if needed]
- [Exclusion 2 with context if needed]

## Affected Systems

- [System 1 from standard systems list]
- [System 2]

## Defaults & Behaviors

[Key defaults and behavioral decisions. Use sub-bullets if multiple settings/fields.]

- **Setting/Field Name**: Default value, required/optional, who can change, edge cases
- **[Next item]**: [Details]

## Technical Considerations

[Technical notes, constraints, dependencies, backward compatibility, data migration if needed.]

## Open Questions

- [Question 1 — engineering decision, unknown detail, or future consideration]
- [Question 2]

## Card Types Requested

[The manifest: which card types the user wants generated. Example: "Epic + Stories" or "Initiative, then Epic breakdown"]
```

### Phase 6: Local File Persistence

After user approval, automatically save to `cards/intakes/`.

**Filename convention:** `intake-{product}-{feature-name}.md` where product and feature-name are lowercase kebab-case.

Example: `intake-webapp-notification-system.md`

**YAML Frontmatter:**
```yaml
---
title: "INTAKE-[Product]-[FeatureName]"
type: intake
status: Complete
product: "[Inferred or asked]"
module: "[Inferred or asked]"
client: "[Inferred or asked]"
generated_initiatives: []
generated_epics: []
source_conversation: "[Conversation title or context]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**Card body:** Insert the full intake summary (from Phase 5) as the card body below the frontmatter. Use blank lines between sections for proper spacing.

**After successful save, display:**
```
Intake saved to cards/intakes/{filename}.md
```

**Do NOT repeat the full intake summary in conversation.** Keep handoff clean and focused.

### Phase 7: Orchestrated Card Generation

After saving the intake to the local file, read the "Card Types Requested" section of the approved summary. This is the manifest that drives automatic card generation via sub-agents.

**Orchestration Flow:**

1. Read the manifest from the approved intake (e.g., "Initiative + Epic + Stories" or "Epic + Stories")

2. Spawn agents based on the manifest using the Task tool. Each agent receives scoped context only:

   **If Initiative is requested:**
   Spawn an Initiative agent with:
   - The approved intake summary (full text)
   - Instruction to read the Initiative template from `skills/pm-methodology/templates/initiative-template.md`
   - The target folder path: `cards/initiatives/`
   - The frontmatter schema for Initiatives from the local-routing skill
   - The intake filename (for `source_intake` field)
   - The conversation title (for `source_conversation` property)
   - Instruction to write the Initiative to a local file and return the created filename

3. **Handle dependencies:** If Epics are also requested, wait for the Initiative agent to return its filename before spawning Epic agents. If only Epics are requested (no Initiative), spawn them immediately.

   **For each Epic requested:**
   Spawn an Epic agent with:
   - The approved intake summary
   - Instruction to read the Epic template from `skills/pm-methodology/templates/epic-template.md`
   - The target folder path: `cards/epics/`
   - The frontmatter schema for Epics from the local-routing skill
   - The Initiative filename (for `parent` field, if an Initiative was created)
   - The intake filename (for `source_intake` field)
   - The conversation title
   - Instruction to write the Epic to a local file and return the created filename

4. **If Stories are requested:** Wait for the relevant Epic agent(s) to return, then spawn Story agents.

   **For each Story identified in the Epic's suggested breakdown:**
   Spawn a Story agent with:
   - The approved intake summary
   - The specific story scope from the Epic's suggested breakdown
   - Instruction to read the Story template from `skills/pm-methodology/templates/story-template.md`
   - The target folder path: `cards/stories/`
   - The frontmatter schema for Stories from the local-routing skill
   - The parent Epic filename (for `parent` field)
   - The conversation title
   - Instruction to write the Story to a local file and return the created filename

5. **Run independent agents in parallel** by including multiple Task tool calls in a single response. For example, if the manifest says "Initiative + 2 Epics," spawn the Initiative agent first, then once it returns, spawn both Epic agents in parallel.

6. **After all card agents complete,** spawn a Checkpoint agent with:
   - The approved intake summary
   - The list of all created card filenames (Initiatives, Epics, Stories)
   - Instruction to write a Knowledge Checkpoint to `cards/checkpoints/`
   - A summary of what was generated from the intake

7. **Update relations:** After all agents complete, update the intake file:
   - Add any Initiative filenames to `generated_initiatives`
   - Add any Epic filenames to `generated_epics`
   - Update the intake's `updated` date
   - Set intake status to `Handed Off`

   Also update parent cards' `children` arrays:
   - Add Epic filenames to their parent Initiative's `children` array
   - Add Story filenames to their parent Epic's `children` array
   - Update `updated` dates on all modified parent cards

8. **Final output:**
   ```
   Cards generated from intake:
   - Initiative: {filename} (if created)
   - Epic: {title} — {filename} (for each)
   - Story: {title} — {filename} (for each)
   - Checkpoint: {filename}
   ```

**Key rules for orchestration:**
- Each spawned agent gets ONLY its scoped context (intake summary + relevant template + target folder + frontmatter schema), not the full conversation history
- The parent Claude instance acts as the orchestrator, reading results and deciding what to spawn next
- If any agent fails, report the error and offer to retry that specific agent
- Never skip the Checkpoint agent; it captures the full record of what was generated

---

## Affected Systems Reference

For affected systems, read the systems list from `memory/context/products.md` YAML frontmatter `systems` key. If no config exists, accept freeform system names and suggest running `/productivity:setup-org`.

---

## Interview Tips

### Maintaining Conversational Flow
- Ask 3-4 related questions per message, grouped by topic
- Use follow-ups naturally ("That makes sense. One more detail—...")
- Mirror the user's language and context
- Acknowledge what they've provided before asking for more

### Handling Provided Context
- If user provides screenshots: "I see [specific UI element]. Should the new feature follow this pattern?"
- If user provides documents: "I've reviewed [document]. To clarify—..."
- If user references existing features: "I understand this is similar to [feature]. Specifically, should we...?"
- Always reference back to what they shared; don't make them repeat it

### When to Skip Questions
- Skip Topic 1 (Problem & Driver) if the user has already described a clear problem
- Skip Topic 3 (Solution Details) if detailed UI/UX is provided via mockups
- Skip Topic 4 (Defaults & Behaviors) if defaults are obvious from context
- Always ask Topic 2 (Scope), Topic 5 (Technical), and Topic 6 (Open Questions)—these are critical

### Handling "I Don't Know"
When a user says "I don't know," respond with:
- "That's fine—let's capture that as an Open Question for engineering to decide."
- OR: "What would happen if we [specific scenario]? That might help us figure it out."
- Never force a decision; unknowns belong in the intake.

---

## Example Interview Session

**User Input:** "We need to add a notification system to WebApp for Acme Corp."

**Assistant Response (Phase 2, Topic 1):**
"Great, I'd like to understand the context. What's the main problem today—are users missing important updates, or is there manual work that could be automated? And who's most affected—the end users who need to be notified, or the admins managing notifications?"

**User Response:** "Both. Admins spend hours manually sending updates, and users miss critical alerts because there's no centralized notification system."

**Assistant Response (Phase 2, Topic 2):**
"I see. So admins need better tools to manage notifications efficiently. A couple of questions: Should this cover all notification types (email, in-app, push), or should we start with one channel? And is this for all user roles, or a specific subset?"

**[Interview continues across all seven topics...]**

**Phase 4 (Confirmation):**
"Let me confirm what I'm hearing:

**The Problem:** Admins at Acme Corp spend hours manually sending updates, and users miss critical alerts because there is no centralized notification system.

**The Solution:** Build a notification engine in WebApp that supports in-app and email notifications with configurable rules and templates.

**In Scope:** In-app notifications; email notifications; admin configuration UI; Acme Corp tenant only (phase 1)

**Out of Scope:** Push notifications, SMS, notification analytics dashboard (future phases)

**Technical Notes:** Integrates with WebApp event system; may need a dedicated notification service; backward compatibility with existing email workflows

**Card Types:** Epic + Stories

Does this match your understanding?"

**User:** "Yes, but we should also note that users currently have no way to set notification preferences—that's an open question about how granular the controls should be."

**Assistant:** "Perfect, I've added that as an Open Question. Let me save this intake."

**[Saves to local file]**

"Intake saved to cards/intakes/intake-webapp-notification-system.md

Ready to generate Epic + Stories. Use /epic or /story to generate cards from this intake."

---

## Taxonomy Inference

When inferring **Product**, **Module**, and **Client** from context:

Read the taxonomy from `memory/context/` per the Config Resolution Protocol. Use the descriptions in the memory files to match user language to configured values. For example, if a user mentions "the mobile app," match against the products list and descriptions in `memory/context/products.md`.

If taxonomy is not configured:
- Accept freeform values without validation
- Suggest: "Run `/productivity:setup-org` to configure your product taxonomy for validated suggestions"

If a user's language doesn't match any configured value:
- Ask: "Which product does this relate to?" and show the configured options
- If they provide a new value, offer to add it to the taxonomy

---

## Accessibility & Inclusivity Notes

- Offer to record or summarize the conversation for reference
- Use plain language; avoid acronyms without explanation
- For visual mockups, describe elements aloud as well as showing them
- If the user is reviewing with stakeholders async, offer to format the final intake for easy sharing

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-06 | Initial command definition |
| 1.1 | 2026-02-08 | Adapted for local file persistence |
