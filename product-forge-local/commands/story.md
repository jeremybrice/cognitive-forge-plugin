---
description: Generate, update, or review Story cards (engineer-level work items under an Epic).
---

# Story Command

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

When the user invokes `/story create` or `/story` with context suggesting creation, this command gathers context and generates one or more structured Story cards for engineer implementation.

### Process

#### 1. Gather Context

Accept input from one of these sources:
- An approved intake output
- An existing Epic card
- Conversation context from the current session
- Direct user prompt describing the Story or Stories

Stories can be generated in batches if multiple related stories are needed to cover an Epic's Suggested Story Breakdown.

Determine the parent Epic if available, as Story scope must align with Epic goals.

#### 2. Read the Story Template

Fetch the template from `skills/pm-methodology/templates/story-template.md` to understand required sections, formatting standards, and critical rules.

#### 3. Generate Story Card(s)

Create one or more structured Story cards with the following sections:

**Story Title**: Choose the most appropriate format from these options:

- User Story Format: "As a [role], I want [goal], so that [benefit]" (good for feature work)
- Simple Directive Format: Brief, action-oriented description, typically 5-10 words (good for backend, infrastructure, or focused work)

**Background / Context**: 1-2 paragraphs explaining why this story exists. Include current system behavior, the problem or limitation being addressed, and business impact or user pain points. Provide enough context that an engineer picking up this Story mid-sprint understands the "why" without needing to read the Epic.

**Feature Requirements / Functional Behavior**: This section is divided into two subsections to ensure clarity.

**UI Behavior**: Detail how the feature appears and behaves on screen. Include new UI elements and their placement, user interactions and workflows, visual feedback and states, and modal behaviors, tooltips, and messages. Use bullet points for clarity.

**Business Rules**: Describe the rules and constraints that govern feature behavior from a business perspective. Include conditions that trigger actions, validation rules and constraints, state transitions and their triggers, edge case handling from a user perspective, and permission and access rules. Use bullet points for clarity.

CRITICAL: Business Rules must NOT include database field names, API specifications, query structures, or implementation-specific language. Product defines the "what" and "why." Engineering defines the "how."

**Acceptance Tests**: Provide 4-6 tests covering happy path, edge cases, error conditions, and permission/validation checks. Each test uses this format:

```
**Test N: [Descriptive Test Name]**
- **Steps**:
  1. [First action]
  2. [Second action]
  3. [Third action]
- **Expected Result**: [Clear description of expected outcome]
```

Write in imperative mood. Be specific about values. Each test must be specific enough to turn into automated test cases or clear manual test steps.

**Implementation Context**: Provide engineering with relevant context about the problem space without prescribing solutions. Include known constraints (performance, compliance, regulatory), related systems or recent changes, questions engineering should consider during design, references to similar patterns elsewhere in the product, and scale considerations.

CRITICAL: Implementation Context must NOT include specific database field names or table structures, API endpoint definitions or query parameters, code-level implementation instructions, or technology or library recommendations. The tone should be informative, not directive. Use bullet points.

**Implementation Flexibility** (optional): Include this closing statement when engineering has latitude: "The technical approach is at engineering's discretion. This story defines required behaviors and outcomes; implementation details should be determined during technical design."

#### 4. Present to User for Confirmation

Display the generated Story card(s) to the user. Ask for confirmation before proceeding to save.

For batch stories, show all stories and ask for approval of the set before saving.

Provide an opportunity for the user to request revisions or modifications.

#### 5. Save to Local File

On user approval, save Story card(s) as markdown files.

**Target directory:** `cards/stories/`

**Filename:** `story-NNN-{slug}.md` where NNN is a zero-padded 3-digit sequential number. Scan the existing `cards/stories/` directory for the highest story number and increment by one.

**YAML Frontmatter (for each story):**
```yaml
---
title: "[Story Title]"
type: story
status: Draft
product: "[From taxonomy]"
module: "[From taxonomy]"
client: "[From taxonomy]"
team: "[Team name]"
parent: "[parent Epic filename without .md]"
story_points: null
jira_card: null
source_conversation: "[Conversation title or context]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**Card body:** Full Story card content with blank lines between major sections. Use `##` headings for each section.

#### 6. After Save

For single story: Display only `Story saved to cards/stories/{filename}.md`

For batch stories: Display `Stories saved to cards/stories/:` followed by a list of each story title with its filename.

Do not include additional commentary or action items. Let the user decide next steps.

#### 7. Relation Linking

After saving Story card(s), update the parent Epic:
1. Read the parent Epic file from `cards/epics/`
2. Add each Story's filename (without `.md`) to the Epic's `children` array
3. Update the Epic's `updated` date to today
4. Write the updated Epic file back

### Formatting Rules (CRITICAL)

- Never use tables. Use prose and bullets only. Tables reduce readability and break on mobile interfaces.
- Never prescribe implementation approach. Provide context and constraints, not instructions. Engineers decide "how"; the PM provides "why" and "what."
- Never use dashes to separate thoughts. Dashes only appear in compound words or hyphenated terms.
- Acceptance tests use the named test format (Test N: Name / Steps / Expected Result). Do NOT use Given/When/Then format.
- Business Rules describe business-level behaviors and constraints. Do NOT include database field names, API specifications, or implementation-specific language.

### Story Validation Rules

Before saving, ensure:

1. **Atomic scope**: The Story is completable in 1-3 days by one engineer or a pair. If it feels too large, it's probably an Epic wearing a Story hat.
2. **Business rules, not system logic**: The Story provides "what" and "why" from a business perspective, not "how" from an implementation perspective.
3. **Testable acceptance criteria**: Each acceptance test uses the named test format with Steps and Expected Result, and is specific, observable, and realistic.
4. **Parent Epic identified**: The Story should have a clear parent Epic. If not, consider whether it belongs in a different Epic or needs regrouping.

### Example Workflow

**User input:**
```
/story create
Parent Epic: Demand Forecasting Engine
Create 3 stories for: data pipeline infrastructure, baseline forecasting models, and forecast export and serving
```

**Command**:
1. Reads the Story template for structure
2. Gathers context from user input and identifies the parent Epic
3. Generates 3 complete Story cards following the template format
4. Presents all 3 stories to the user for review and approval
5. On approval, saves each story to `cards/stories/` with sequential numbering and updates the parent Epic's `children` array
6. Returns: `Stories saved to cards/stories/:` with list of filenames

---

## Update Mode

Update mode modifies an existing card with new context. It is a single-agent flow with mandatory user approval before writing back.

### Workflow

**Step 1: Identify the card**
Accept a card reference from the user: a filename, a card title, or enough context to search for it. Read the existing card from `cards/stories/`.

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

**Business Rules:**
- Added: "Setting changes take effect immediately"
- Modified: Permission rule updated from Managers only to Managers and Route Managers

**Acceptance Tests:**
- Added: Test 5 covering the new permission scenario

All other sections unchanged.
```

**Step 5: Get approval**
Ask the user to confirm or adjust the proposed changes.

CRITICAL: Never silently overwrite a card. The approval step is mandatory. This is especially important for Stories that engineering may already be working from.

**Step 6: Write back**
On approval, update the markdown file:
1. Parse the existing frontmatter and body
2. Apply the approved changes to the affected sections and properties
3. Update the `updated` date in frontmatter to today
4. Write the complete file back to `cards/stories/{filename}.md`

Only update the properties and sections that actually changed.

---

## Review Mode

Review mode reads an existing Story and provides a quality assessment focused on whether an engineer could work from it without additional context. It does NOT automatically compare against other Stories.

### Workflow

**Step 1: Identify the card**
Accept a card reference. Read the existing Story from `cards/stories/`.

**Step 2: Assess on its own merits**
Evaluate the Story against these criteria:

**Engineer Self-Sufficiency**
- Could an engineer pick this up and start working without asking the PM clarifying questions?
- Is the "why" clear enough for the engineer to make good judgment calls?
- Is there enough context about the parent Epic/Initiative?

**Acceptance Test Quality**
- Are acceptance tests specific and testable?
- Do they use the named test format (Test N: Name / Steps / Expected Result)?
- Do they cover happy path, edge cases, and error states?
- Could QA write automated tests from these criteria?

**Business Rules Quality**
- Are business rules written from a business perspective?
- Do they avoid implementation-specific language (database fields, API specs, etc.)?
- Are conditions, constraints, and edge cases clearly described?
- Could an engineer implement these rules with a different technical approach and still satisfy them?

**Implementation Context Sufficiency**
- Are affected systems identified?
- Is there enough context without being prescriptive?
- Are known constraints documented?
- Are backward compatibility considerations addressed?

**Scope Appropriateness**
- Is this story atomic (one sprint or less)?
- Could this story be broken down further, and should it be?
- Is there scope that belongs in a separate story?

**Formatting Compliance**
- No tables used
- No dashes separating thoughts
- Bullets for UI Behavior and Business Rules
- Named test format for Acceptance Tests
- No implementation prescriptions (context yes, instructions no)

**Step 3: Present the assessment**
Structured assessment with ratings (Strong, Adequate, Needs Attention) per criterion, specific observations, and improvement suggestions. For Stories, flag any acceptance test that is not testable or does not follow the named test format.

**Step 4: Cross-card comparison (only if user-requested)**
Only when the user explicitly names another card. Never proactively search.

---

## Notes

- Stories are engineer-level work items. They should be readable in 5-10 minutes.
- A well-written Story provides enough context that an engineer doesn't need to ask "why" but retains freedom on "how."
- Acceptance tests are the contract between product and engineering. They should use the named test format (Test N: Name / Steps / Expected Result) and be specific and testable.
- Business Rules describe business-level behaviors and constraints, never implementation details. Product defines the "what" and "why." Engineering defines the "how."
- For batch story generation, coordinate with the team to ensure all stories fit within the parent Epic's scope and are properly sequenced.
- If a Story references a parent Epic that doesn't exist yet, consider generating the Epic first or creating a placeholder relation that can be resolved later.
