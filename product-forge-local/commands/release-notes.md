---
description: Generate product release notes from feature descriptions, Jira stories, or product documents. Produces .docx files and writes a tracking entry to a local markdown file.
---

# Release Notes Command

## Overview
The `/release-notes` command generates professional product release notes from feature descriptions, Jira stories, or product documents. It produces both Internal and External versions in Word format (.docx) and persists a tracking entry as a local markdown file for historical reference.

## Input Acceptance

### Expected Input Formats
Accept any of the following input types:

1. **Jira Story Content**: Paste story titles and descriptions directly
   - Story key and title
   - Acceptance criteria or description
   - Multiple stories separated by line breaks

2. **Feature Descriptions**: Raw feature text from product documents
   - Narrative descriptions of new capabilities
   - Enhancement summaries
   - Bug fix descriptions

3. **Batch Input**: Multiple items at once
   - Reference previously generated cards
   - Combine stories from different epics
   - Mix feature types in single input

### Input Processing
- Accept feature descriptions in any format (plain text, copied from Jira, product docs)
- User may provide partial information; ask for clarification if needed
- Strip Jira metadata (ticket numbers, assignees) during processing
- If input is ambiguous, prompt user for category clarification

---

## Categorization Logic

For each input item, determine its category by asking:

### Decision Tree
1. **Did this capability exist before?**
   - No → **What's New**
   - Yes → Continue

2. **Was something broken that we fixed?**
   - Yes → **Bug Fixes**
   - No → Continue

3. **Otherwise → Improvements**

### Category Definitions

#### What's New
Brand new capabilities, modules, or features that didn't exist before.

**Indicators:**
- "New [system/module]"
- "Introduced..."
- "Added support for..."
- "Now available..."
- First appearance of functionality
- Major new system or integration

**Example:**
- "New vendor integration platform for real-time inventory sync"
- "Introduced automated pricing engine"

#### Improvements
Enhancements to existing functionality. Better performance, streamlined workflows, refined UX.

**Indicators:**
- "Enhanced..."
- "Improved..."
- "Updated..."
- "Streamlined..."
- Performance optimizations
- UI/UX refinements
- Workflow optimizations

**Example:**
- "Enhanced dashboard load times by 40%"
- "Improved bulk import workflow with better error reporting"

#### Bug Fixes
Corrections to broken or misbehaving functionality. Something that wasn't working now works.

**Indicators:**
- "Fixed..."
- "Resolved..."
- "Corrected..."
- "Issue where..."

**Pattern:** "Fixed an issue where [problem]. [Resolution]."

**Example:**
- "Fixed an issue where inventory counts were not syncing with supplier reports. Counts now update immediately upon submission."

---

## Internal vs External Filtering

Generate **BOTH versions** of release notes. The content differs based on audience.

### Include in BOTH Versions
- Features operators interact with directly
- UI/UX improvements visible to users
- Bug fixes affecting daily operations
- Performance improvements users notice
- New capabilities in operator workflows
- Process improvements affecting operators

### Internal Only (Exclude from External)
- API/integration enhancements (backend infrastructure)
- Backend refactoring and code modernization
- Developer tooling changes
- Legacy command cleanup
- Database schema changes
- System architecture improvements
- Internal performance metrics
- Developer API additions
- Infrastructure updates

### Decision Test
**Would a non-technical operator care about or notice this change?**
- Yes → Include in both versions
- No → Internal only

**Examples:**

| Item | Internal | External | Reason |
|------|----------|----------|--------|
| "New inventory sync API for third-party integrations" | ✓ | ✗ | Developers use it; operators don't care |
| "Enhanced product search with autocomplete" | ✓ | ✓ | Operators use search every day |
| "Refactored database schema for location records" | ✓ | ✗ | Backend change operators don't notice |
| "Fixed issue where reports failed to generate" | ✓ | ✓ | Affects daily operations |
| "Upgraded authentication framework" | ✓ | ✗ | Transparent to operators |

---

## Writing Style

Follow these principles for all entries:

### 1. Present Tense
Use past tense for completed work, but focus on outcomes:
- "We introduced..." (not "We are introducing...")
- "Fixed an issue..." (not "Fixed a bug that...")
- "Operators can now..." (not "Operators will be able to...")

### 2. User-Focused
Emphasize value and outcomes, not technical implementation:
- ✓ "Operators can now export reports in Excel format with custom fields"
- ✗ "Implemented ExcelJS export library with field mapping layer"

### 3. Concise
- Bug fixes: ~1 paragraph (2-3 sentences)
- Features: 2-3 paragraphs max
- Improvements: 1-2 paragraphs
- Lead with the benefit, not the change

### 4. Accessible
Write for operators and business users, not developers:
- Avoid jargon: "real-time sync" not "webhook persistence"
- Avoid acronyms without context
- Use simple language

### 5. Standalone
Each entry must be complete without referencing other items or tickets:
- ✓ "Fixed an issue where inventory counts were not updating when syncing with supplier systems. Counts now refresh automatically."
- ✗ "Fixed PROJ-1234 per QA feedback in ticket"

### 6. Specific and Concrete
Include measurable impact when available:
- ✓ "Improved dashboard load times by 40%"
- ✓ "Streamlined bulk import process; now supports up to 50,000 items per file"
- ✗ "Made things faster"

### What to Avoid
- Jira ticket numbers (PROJ-1234, PROJ-5678)
- Internal references ("QA validated", "per ticket XYZ", "per engineering review")
- Developer jargon ("microservice architecture", "schema migration", "async callback")
- Database terminology ("table optimization", "index reorganization")
- Future tense ("will add", "will fix", "coming soon")
- Excessive passive voice ("was improved" vs "we improved")
- Negative framing ("no longer fails" vs "now works reliably")

---

## Document Generation

### File Naming Convention
```
Release_Notes_-_{Product}_{Version}_YYMMDD_-_[Internal|External].docx
```

### Version Format
`{product}-YYMMDD`

### Word Document Structure

Generate documents using Word styles:

**Heading 3:** Document title
**Heading 4:** Section headers (What's New, Improvements, Bug Fixes, Helpful Links, How to Update)
**List Bullet:** Entry titles (bold) and descriptions
**Normal:** Version and Release Date lines

### Document Template

```
{Product} Release Notes - [Internal|External]

Version: {product}-YYMMDD
Release Date: [Month Day, Year]

[BLANK LINE]

What's New

[Entry 1 Title]. [Entry 1 description - 2-3 sentences]

[Entry 2 Title]. [Entry 2 description - 2-3 sentences]

[BLANK LINE]

Improvements

[Entry 1 Title]. [Entry 1 description - 1-2 sentences]

[Entry 2 Title]. [Entry 2 description - 1-2 sentences]

[BLANK LINE]

Bug Fixes

[Entry 1 Title]. [Entry 1 description - 1-2 sentences]

[Entry 2 Title]. [Entry 2 description - 1-2 sentences]

[BLANK LINE]

Helpful Links

Internal Version: [Link to relevant documentation or "See release-notes tracking entry"]
External Version: [None available]

[BLANK LINE]

How to Update

[Standard update instructions - typically provided by deployment team]

Example: "Contact your system administrator to schedule an update. Updates are typically deployed during scheduled maintenance windows."
```

### Generation Steps

1. **Categorize** each input item into What's New, Improvements, or Bug Fixes
2. **Filter** for Internal version (include all) and External version (exclude technical items)
3. **Write** each entry following the style guide above
4. **Format** entries with consistent structure within each section
5. **Create** .docx file using Word style formatting
6. **Generate** two documents: one Internal, one External
7. **Publish** tracking entry to local markdown file

### Using the docx Skill
- Call the docx skill with document content and formatting
- Apply Heading 3 style to title
- Apply Heading 4 style to section headers
- Apply List Bullet style to entry titles (bold) with descriptions following
- Apply Normal style to version/date lines
- Set appropriate margins and spacing for professional appearance

---

## Local File Persistence

After generating both .docx files, write a tracking entry to `cards/release-notes/`.

### Filename Convention
`release-notes-YYMMDD.md` (e.g., `release-notes-260208.md`)

### YAML Frontmatter
```yaml
---
title: "{Product} Release YYMMDD"
type: release-note
release_date: YYYY-MM-DD
product: ""    # From memory/context/products.md
status: Draft
version: "{product}-YYMMDD"
related_stories:
  - story-filename-1
  - story-filename-2
source_conversation: "[Conversation title or context]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### Entry Condensation
When populating the tracking card body, condense entries to essential information:
- What's New: List features with brief descriptions (1-2 sentences each)
- Improvements: List improvements with impact (1 sentence each)
- Bug Fixes: List fixes with resolution (1 sentence each)

### Card Body Content
The card body contains condensed versions of the release note entries:

```markdown
## What's New

- **[Entry Title]**: [1-2 sentence description]

## Improvements

- **[Entry Title]**: [1 sentence description]

## Bug Fixes

- **[Entry Title]**: [1 sentence description]
```

### Example Tracking Entry
```
title: "{Product} Release 260206"
version: "{product}-260206"

What's New:
  - New inventory sync API for third-party integrations
  - Introduced automated pricing engine with real-time updates

Improvements:
  - Enhanced dashboard with 40% faster load times
  - Improved bulk import workflow with progress tracking

Bug Fixes:
  - Fixed issue where reports failed during large data exports
  - Resolved synchronization delays in vendor order feeds
```

### After Save
Display:
```
Release notes generated:
- Internal: [.docx file path]
- External: [.docx file path]
- Tracking entry: cards/release-notes/{filename}.md
```

---

## Verification Checklist

After generation, verify the following:

### Content Verification
- All entries are in the correct category (What's New, Improvements, Bug Fixes)
- No Jira ticket numbers present
- No internal references
- No developer jargon or technical terms
- Present tense used throughout
- Bug fixes follow "Fixed an issue where..." pattern
- Each entry is standalone and complete
- User-friendly titles
- Spelling and grammar correct

### Document Verification
- Internal version generated
- External version generated
- Version format correct ({product}-YYMMDD)
- Both versions have correct section headers
- Formatting consistent

### Filtering Verification
- Internal version includes all items
- External version excludes API/integration/backend changes
- External version includes operator-facing features
- No sensitive information in either version

---

## Orchestration Pipeline

The release notes workflow uses a two-agent pipeline for clean separation of concerns.

### Agent 1: Draft Agent

Spawn a Draft Agent via the Task tool with:
- The raw feature/story descriptions provided by the user
- The categorization logic from this command
- The writing style guidelines from this command
- The internal vs. external filtering rules

The Draft Agent:
1. Categorizes each input item
2. Writes user-facing descriptions following the style guide
3. Produces BOTH Internal and External versions
4. Returns the complete drafted content for all categories and both versions

### Agent 2: Publish Agent

After the Draft Agent returns, spawn a Publish Agent with:
- The drafted release note content (all categories, both versions)
- The .docx template structure and Word style specifications
- The file naming convention
- The target folder path: `cards/release-notes/`
- The frontmatter schema for Release Notes from the local-routing skill
- Instruction to read the docx skill for Word document generation

The Publish Agent:
1. Generates both Internal and External .docx files using the docx skill
2. Writes the release note tracking entry to `cards/release-notes/` as a markdown file
3. Returns the .docx file paths and the tracking entry filename

### Pipeline Flow

```
User provides input → Draft Agent (categorize + write) → Publish Agent (format .docx + local file) → Output
```

### Error Handling
- If the Draft Agent fails, report the error and offer to retry categorization
- If the Publish Agent fails on .docx generation, present the drafted content to the user and offer manual formatting
- If the Publish Agent fails on local file write, still deliver the .docx files and retry the file write separately

---

## Implementation Notes

### Command Invocation
```
/release-notes
[paste feature descriptions, Jira stories, or product document text]
```

### Required Tools
- **docx skill**: For Word document generation with styles
- **Date/Time utilities**: For version numbering and date formatting

### Error Handling
- If input is ambiguous, ask user for category clarification
- If document generation fails, notify user with specific error
- If local file write fails, save document locally and inform user
- If verification checks fail, list issues and ask for review

### User Guidance
Provide clear prompts when:
- Input category is unclear
- Additional information needed for complete entry
- Entries exceed recommended length
- Jira references or internal terms detected
- Verification checklist items fail

---

## Examples

### Example 1: New Feature Entry
**Input:** "Added new vendor portal that allows suppliers to submit orders directly through the platform"

**What's New Category:**
- New vendor portal for direct order submission. Suppliers can now submit orders directly through the platform interface, reducing email coordination and improving order accuracy.

**External:** ✓ Include (operators use this portal)
**Internal:** ✓ Include

---

### Example 2: Bug Fix Entry
**Input:** "Fixed PROJ-2847 where inventory sync was failing when product codes contained special characters"

**Bug Fixes Category:**
- Fixed an issue where inventory synchronization failed for product codes containing special characters like hyphens and underscores. The system now correctly processes all valid product code formats.

**Cleaned Entry (no Jira number):**
- Fixed an issue where inventory synchronization failed for product codes containing special characters. The system now correctly processes all valid product code formats.

**External:** ✓ Include (affects daily operations)
**Internal:** ✓ Include

---

### Example 3: Internal-Only Improvement Entry
**Input:** "Refactored the authentication middleware to use OAuth 2.0 standard flows instead of custom implementation"

**Improvements Category:**
- Refactored authentication system to use standard OAuth 2.0 protocols. Improves security posture and simplifies integration with third-party systems.

**External:** ✗ Exclude (developer/infrastructure concern)
**Internal:** ✓ Include

**Decision:** Operators don't interact with or notice authentication implementation changes. Exclude from External.

---

### Example 4: Multiple Items Batch Input
**Input:**
```
1. Enhanced the reporting dashboard with new chart types and drill-down capability
2. Fixed issue where bulk imports sometimes duplicated records
3. Updated the vendor API to support OAuth 2.0 authentication
4. Improved mobile app response times by optimizing cached data
```

**Categorization:**
1. What's New → Enhanced reporting dashboard. (Actually this sounds like Improvements - new chart types enhance existing dashboard)
   - **Correct Category: Improvements**
2. Bug Fixes
3. Improvements (internal only - backend API change)
4. Improvements

**External Version Excludes:** Item 3 (API/backend change)

---

## FAQ

**Q: What if the user provides Jira story keys?**
A: Strip the ticket number during processing. Extract the story description and title, then write the release note entry in your own words following the style guide.

**Q: Can I include quantified metrics?**
A: Yes! If available, include specific metrics: "Improved dashboard load times by 40%" or "Bulk import now supports up to 50,000 items per file."

**Q: What if an item doesn't fit neatly into a category?**
A: Ask the user for clarification. Example: "Is this a new capability, an enhancement to existing functionality, or a fix to broken behavior?"

**Q: Should I use passive voice?**
A: Minimize it. Use active voice: "We improved dashboard performance" not "Dashboard performance was improved."

**Q: Can I combine multiple small items into one entry?**
A: Only if they're closely related. Example: "Improved reporting with new export formats (PDF, Excel) and better filtering options."

**Q: What's the maximum length for an entry?**
A: 3 sentences for What's New, 2 sentences for Improvements, 2 sentences for Bug Fixes.

**Q: Who is the audience for External release notes?**
A: Product operators and business users who use the software daily. People who interact with the product regularly but don't care about infrastructure or developer tooling.

**Q: How do I handle security-related items?**
A: If it's a security fix, it goes in Bug Fixes. If it's security enhancement (like OAuth support), it's Internal-only unless operators see direct benefit.
