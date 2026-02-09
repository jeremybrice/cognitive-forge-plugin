# Release Notes Template

Use this template when generating release note documents and entries.

## Structure

### What's New

Brand new capabilities, modules, or features that did not exist before. Each entry should be user-focused and describe the value to end users.

**Writing rules for What's New entries:**
- Lead with what the user can now do
- Use present tense ("Users can now..." not "Users will be able to...")
- 2-3 sentences maximum per entry
- No Jira ticket numbers or internal references

Example:
"**New Vendor Portal for Direct Order Submission.** Suppliers can now submit orders directly through the WebApp interface, reducing email coordination and improving order accuracy. The portal supports bulk order uploads and real-time order status tracking."

### Improvements

Enhancements to existing functionality. Better performance, streamlined workflows, refined UX.

**Writing rules for Improvements entries:**
- Lead with what improved and the measurable impact
- 1-2 sentences per entry
- Include specific metrics when available (e.g., "40% faster load times")

Example:
"**Enhanced Dashboard Load Performance.** Dashboard pages now load 40% faster, with improved caching for frequently accessed reports and real-time data widgets."

### Bug Fixes

Corrections to broken or misbehaving functionality.

**Writing rules for Bug Fixes entries:**
- Follow the pattern: "Fixed an issue where [problem]. [Resolution]."
- 1-2 sentences per entry
- Describe the problem from the user's perspective, not the technical root cause

Example:
"**Data Sync for Special Characters.** Fixed an issue where data records failed to sync for entries containing special characters like hyphens and underscores. The system now correctly processes all valid data formats."

### Internal vs External Filtering

Generate BOTH Internal and External versions of release notes.

**Include in BOTH versions:**
- Features operators interact with directly
- UI/UX improvements visible to users
- Bug fixes affecting daily operations
- Performance improvements users notice

**Internal Only (exclude from External):**
- API/integration enhancements (backend infrastructure)
- Backend refactoring and code modernization
- Developer tooling changes
- Database schema changes
- System architecture improvements

**Decision test:** Would a non-technical end user care about or notice this change? Yes = both versions. No = internal only.

### Writing Style

- **Present tense**: "We introduced..." not "We are introducing..."
- **User-focused**: Emphasize value, not implementation
- **Concise**: Bug fixes ~1 paragraph, features 2-3 paragraphs max
- **Accessible**: Write for end users, not developers
- **Standalone**: Each entry complete without referencing other items
- **No Jira numbers**: Strip all ticket references
- **No internal references**: No "QA validated" or "per ticket XYZ"

### Document Format

**Filename convention:** `Release_Notes_-_{Product}_{Version}_YYMMDD_-_[Internal|External].docx`

**Version format:** `{product}-YYMMDD` (e.g., `WebApp-260208`)

**Heading styles:**
- Heading 3: Document title
- Heading 4: Section headers (What's New, Improvements, Bug Fixes, Helpful Links, How to Update)
- List Bullet: Entry titles (bold) and descriptions
- Normal: Version and Release Date lines

## Properties to Set

When creating a Release Notes entry, populate these properties:

- **Release Title**: Format as "{Product} Release YYMMDD" (e.g., "WebApp Release 260208")
- **Version**: Format as "{product}-YYMMDD" (e.g., "WebApp-260208")
- **Product**: From configured taxonomy
- **Status**: Draft (until reviewed), Published (after approval), or Internal Only
- **Release Date**: The release date (YYYY-MM-DD)
- **Related Stories**: Filenames of Story cards shipped in this release
- **Created Date**: Auto-populated
- **Source Conversation**: Reference to the conversation

## Tone and Audience

External release notes are written for product end users and business users who use the software daily but do not care about infrastructure or developer tooling. Internal release notes include all items and serve as a complete technical record. Both versions should use professional, clear language with a focus on outcomes and value.
