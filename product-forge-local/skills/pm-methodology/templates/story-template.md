# Jira Story Guide

## Overview

This guide outlines the preferred format for Jira stories. Each story should include five structured sections in the exact order shown below. Stories are the atomic unit of work for sprint planning, providing engineering teams with clear outcomes and business rules for implementation.

**Core Principle:** Product defines the "what" and "why." Engineering defines the "how." Stories should specify required behaviors and outcomes while leaving implementation decisions to engineering.

## Product vs. Engineering Responsibility

Product defines outcomes. Engineering defines implementation.

**Product should specify:**
- What behavior the user experiences
- What business rules govern the feature
- What constraints exist (performance, compliance, compatibility)
- What success looks like
- Edge cases and error states from a user perspective

**Product should NOT specify:**
- Database schema or field names
- API endpoint structure or query parameters
- Code architecture or patterns
- Specific libraries, tools, or technologies
- Internal system naming conventions

**Test yourself:** If an engineer could reasonably achieve the same outcome with a different technical approach, leave the implementation open. Only constrain when the constraint is a business requirement, not a technical preference.

## Story Structure

### 1. Story Title

**Format:** Brief, action-oriented description

**Length:** Keep it concise, typically 5-10 words

**Style:** Can use "As a [user], I want [goal], so that [benefit]" format OR simple directive format

**Examples:**
- "Enable Admins to Bulk Update Notification Templates"
- "Fix Duplicate Delivery When Retry Window Overlaps"
- "Add Export Functionality to Engagement Report"
- "As a campaign manager, I want the system to auto-adjust notification timing based on user activity patterns, so that engagement is optimized and notification fatigue is minimized."

### 2. Background / Context

**Purpose:** Explain why this story exists

**Content:** Include:
- Current system behavior
- Problem or limitation being addressed
- Business impact or user pain points
- Any relevant meeting references or strategic goals

**Length:** 1-2 paragraphs

### 3. Feature Requirements / Functional Behavior

Split into two distinct subsections:

#### UI Behavior

**Content:** Detail how the feature appears and behaves on screen

**Include:**
- New UI elements and their placement
- User interactions and workflows
- Visual feedback and states
- Modal behaviors, tooltips, and messages

**Format:** Use bullet points for clarity

#### Business Rules

**Content:** Describe the rules and constraints that govern feature behavior from a business perspective

**Include:**
- Conditions that trigger actions
- Validation rules and constraints
- State transitions and their triggers
- Edge case handling from a user perspective
- Permission and access rules

**Format:** Use bullet points for clarity

**Avoid:** Database field names, API specifications, query structures, or implementation-specific language

### 4. Acceptance Tests

**Format:** Each test should include:
- **Test name**: Descriptive title
- **Steps**: Numbered list of actions
- **Expected Result**: Clear outcome

**Quantity:** Include 4-6 tests covering:
- Happy path scenarios
- Edge cases
- Error conditions
- Permission/validation checks

**Style:** Write in imperative mood, be specific about values

**Example Structure:**
```
**Test 1: Setting Toggle and Default State**
* **Steps**:
  1. Navigate to Company Settings > Notifications tab
  2. Verify "Auto-Archive Low Engagement Templates" setting appears
  3. Check default state
* **Expected Result**: Setting is present and toggled OFF by default
```

### 5. Implementation Context

**Purpose:** Provide engineering with relevant context about the problem space without prescribing solutions

**Content:** Information that might inform engineering's approach

**Include:**
- Known constraints (performance requirements, compliance rules, regulatory needs)
- Related systems or recent changes that might affect approach
- Questions engineering should consider during design
- References to similar patterns elsewhere in the product
- User volume or scale considerations
- Time-sensitivity or scheduling factors

**Avoid:**
- Specific database field names or table structures
- API endpoint definitions or query parameters
- Code-level implementation instructions
- Technology or library recommendations

**Format:** Use bullet points

**Tone:** Informative, not directive

### 6. Implementation Flexibility (Optional)

Include this statement when you want to explicitly signal that engineering has latitude:

> **Implementation Flexibility:** The technical approach is at engineering's discretion. This story defines required behaviors and outcomes; implementation details should be determined during technical design.

This is particularly useful when:
- The story touches complex or unfamiliar systems
- Multiple valid approaches exist
- You want to encourage engineering creativity
- Prior stories in this area were overly prescriptive

## Properties to Set

When creating a Story card, populate these properties:

- **Story Title**: Clear, action-oriented title from one of the formats above
- **Acceptance Criteria**: Condensed from Acceptance Tests section (high-level bullets acceptable)
- **Story Points**: If estimated by the team (required for sprint planning)
- **Product**: From taxonomy (e.g., WebApp, MobileApp, API Platform)
- **Module**: From taxonomy (e.g., Notifications, User Management, Billing)
- **Client**: From taxonomy (e.g., Acme Corp, Multi-Client, Internal)
- **Status**: Draft (until refined and sprint-ready)
- **Created Date**: Auto-populated
- **Source Conversation**: Link to planning discussion if applicable
- **Parent Epic**: Link to the owning Epic

## Critical Rules for Stories

1. **Never use tables**: All content must be prose or bullets. No tables. Tables reduce readability and break on mobile interfaces.

2. **Never prescribe implementation**: Provide context and constraints, not instructions. Engineers decide "how"; the PM provides "why" and "what."

3. **Acceptance tests must be testable**: Each acceptance test must be specific enough to turn into automated test cases or clear manual test steps. Avoid vague language like "works correctly" or "performs well."

4. **Business rules, not system logic**: Describe rules and constraints from a business perspective. Avoid database field names, API specifications, or implementation-specific language.

5. **One atomic piece of work**: A Story should be completable in 1-3 days by one engineer or a pair. If it feels too large, it's probably an Epic wearing a Story hat.

## Tone and Audience

Write Stories for engineers who will implement them. Use precise, specific language. Explain the "why" in business terms they can relate to (e.g., "This reduces failed deliveries" rather than "Product requirement"). Assume competence and allow engineers to make implementation decisions.

A well-written Story should be readable in 5-10 minutes. If it's longer, it's probably too big or too detailed.

## Best Practices

### General Guidelines

1. **Be Specific About Outcomes**: Use real examples, actual field names visible to users, and specific values
2. **Avoid Implementation Assumptions**: Don't prescribe how engineering should build; describe what users should experience
3. **Consider Edge Cases**: Think about what could go wrong from a user perspective
4. **Include Validation**: Specify min/max values, required fields, and error handling as business rules

### Common Patterns

1. **Settings/Toggles**: Always specify default state (usually OFF), who can change it, and behavior in both states
2. **Bulk Operations**: Include both single and bulk operation scenarios; note if performance at scale is a concern
3. **Date/Time Features**: Consider timezone implications from a user perspective; specify display formats
4. **Permissions**: Clarify role-based access as business rules (who can see/do what)
5. **UI Elements**: Specify exact placement when important; describe states (enabled, disabled, hidden)

### Writing Style

- Use present tense for current behavior
- Use future tense or imperative for desired behavior
- Be concise but thorough
- Include specific examples with real data
- Write Background section for business stakeholders; write Business Rules for anyone

## Example Story Card #1

**Story Title**
*As a campaign manager, I want the system to auto-adjust notification timing based on user activity patterns, so that engagement is optimized and notification fatigue is minimized.*

**Background / Context**
During peak usage periods like end-of-quarter or product launches, notification delivery often conflicts with high user activity windows, leading to low open rates and increased unsubscribe events. Operators currently adjust send times manually, but they lack visibility into real-time user activity patterns. This feature will leverage historical engagement data and activity signals to proactively adjust notification delivery timing, reducing fatigue and improving engagement rates.

**Feature Requirements / Functional Behavior**

**UI Behavior**
- Add a new toggle under "Campaign Settings" labeled: Enable Smart Delivery Timing
- When enabled, a tooltip should explain: "This feature adjusts notification send times using user activity patterns and engagement trends."
- If toggled ON, an icon (clock + optimization spark) appears on the Campaign Dashboard and Delivery Summary pages to indicate timing adjustments were applied.
- Hovering over the icon displays: "Send time adjusted based on activity patterns for [User Segment Name]."

**Business Rules**
- System identifies high-activity windows within a rolling 14-day period based on user engagement history.
- For each notification template in the campaign, compare average open rates against time-of-day engagement patterns.
- Adjust send times to align with peak engagement windows without clustering too many notifications in a single window.
- Target at least a 15% improvement in open rates compared to static scheduling.
- Operators must be able to manually override any automated timing adjustment.
- Smart timing should only apply to campaigns tagged with "engagement-optimized" or campaigns targeting segments with sufficient historical data.

**Acceptance Tests**

**Test 1: Activity Pattern Integration**
- **Steps**:
  1. Enable Smart Delivery Timing for a campaign targeting a segment with known activity patterns.
  2. Add notification templates with different engagement profiles (e.g., promotional: 12% open rate, transactional: 45% open rate).
  3. Generate a delivery schedule for the upcoming week.
- **Expected Result**: The system shifts promotional notifications toward higher-engagement windows and maintains transactional notifications at their standard timing.

**Test 2: Icon Display Confirmation**
- **Steps**:
  1. Navigate to the Campaign Dashboard after enabling Smart Delivery Timing.
  2. Hover over the clock+optimization icon.
- **Expected Result**: Tooltip displays: "Send time adjusted based on activity patterns for [User Segment Name]."

**Test 3: Manual Override**
- **Steps**:
  1. Enable Smart Delivery Timing for a campaign.
  2. Generate delivery schedule with automated timing adjustments.
  3. Manually edit the send time for one notification template.
  4. Save the schedule.
- **Expected Result**: Manual edits are preserved; system does not revert to optimized timing.

**Test 4: Insufficient Data Segment**
- **Steps**:
  1. Enable Smart Delivery Timing for a campaign targeting a segment with less than 14 days of engagement history.
  2. Generate a delivery schedule.
- **Expected Result**: No timing adjustments are applied; schedule reflects standard delivery logic.

**Implementation Context**
- User activity data is available from existing engagement tracking; engineering should evaluate which signals are most predictive.
- Activity pattern data does not need real-time updates; daily refresh is sufficient for this use case.
- Timing calculations should complete before daily campaign scheduling runs to avoid downstream rework.
- This feature aligns with broader engagement optimization initiatives; consider whether shared prediction infrastructure makes sense.
- Initial rollout may be limited to specific client accounts while activity data coverage is validated.

**Implementation Flexibility:** The technical approach is at engineering's discretion. This story defines required behaviors and outcomes; implementation details should be determined during technical design.

## Example Story Card #2

**Story Title**
**Auto-Archive Low Engagement Templates on Campaign Completion**

**Background / Context**
Currently, notification templates remain active in the system indefinitely, regardless of whether they are still being used or performing well. In cases where campaigns complete and templates show consistently low engagement, the system retains these templates, cluttering the template library and making it harder for operators to find high-performing templates. Operations teams have requested an automated solution to archive underperforming templates when campaigns end, while preserving the ability to retain templates with special configurations or active schedules.

**Feature Requirements / Functional Behavior**

**UI Behavior**
- Add new setting in Company Settings > Notifications tab
- Setting label: "Auto-Archive Low Engagement Templates"
- Toggle switch: OFF by default
- Include tooltip: "Automatically archives templates with zero sends and 0% engagement when campaigns are completed"
- No other UI changes required; archiving happens automatically in background

**Business Rules**
- Trigger: Archive evaluation occurs when all segments in a campaign are marked as completed.
- Archive template only when ALL of the following conditions are met:
  - Template has zero sends in the campaign
  - Template engagement rate = 0%
  - Company has "Auto-Archive Low Engagement Templates" enabled
- Templates with active schedules, special configurations, or shared usage across campaigns (0% in one but active in another) are preserved.
- Archiving is reversible; templates can be restored from the archive.
- No audit trail or logging is required for these archives.
- Setting changes take effect immediately without requiring system restart.
- New companies default to OFF; existing companies remain OFF unless explicitly enabled.

**Acceptance Tests**

**Test 1: Setting Toggle and Default State**
- **Steps**:
  1. Navigate to Company Settings > Notifications tab
  2. Verify "Auto-Archive Low Engagement Templates" setting appears
  3. Check default state
- **Expected Result**: Setting is present and toggled OFF by default

**Test 2: Auto-Archive Zero Engagement Template**
- **Steps**:
  1. Enable "Auto-Archive Low Engagement Templates" setting
  2. Create campaign with a template that has 0 sends and 0% engagement
  3. Verify template engagement is 0%
  4. Mark all segments as completed
- **Expected Result**: Template is automatically archived

**Test 3: Preserve Template with Active Schedule**
- **Steps**:
  1. Enable auto-archive setting
  2. Create template with 0% engagement in one campaign but an active schedule in another
  3. Complete the first campaign
- **Expected Result**: Template remains active (it has an active schedule elsewhere)

**Test 4: Preserve Partially Engaged Template**
- **Steps**:
  1. Enable auto-archive setting
  2. Create campaign with 5 templates: 3 with 0% engagement, 2 with active engagement
  3. Complete campaign
- **Expected Result**: Only the 3 zero-engagement templates are archived; the 2 active templates remain

**Test 5: Setting Disabled - No Auto Archive**
- **Steps**:
  1. Ensure setting is OFF
  2. Create zero engagement template (0 sends, 0% engagement)
  3. Complete campaign
- **Expected Result**: Template remains active in system

**Test 6: Specially Configured Template Preserved**
- **Steps**:
  1. Enable auto-archive setting
  2. Create template with special configuration flags but 0% engagement
  3. Complete campaign
- **Expected Result**: Template remains active (has special configuration despite 0% engagement)

**Implementation Context**
- Archiving should only affect templates from the completed campaign, not other templates in the system.
- Consider what happens if campaign completion fails mid-process; partial states should be handled gracefully.
- Campaigns with many templates should not experience noticeable performance impact from this feature.
- This is a soft archive, not a permanent deletion; confirm this aligns with data retention requirements.

**Implementation Flexibility:** The technical approach is at engineering's discretion. This story defines required behaviors and outcomes; implementation details should be determined during technical design.

## Story vs. Epic Decision Tree

Use this to verify you have the right scope:

- Is this work completable by 1 engineer in 1-3 days? -> Story
- Does it require cross-team coordination or multiple engineers? -> Epic
- Can it be tested independently? -> Story
- Is it a complete capability on its own? -> Epic
- Does the engineering team need it broken down further? -> Epic (not a Story)

## When to Ask Clarifying Questions

Before writing a story, clarify:
- Specific behavior for edge cases
- Default values and states
- Permission/access requirements
- Integration with existing features
- Performance requirements or constraints
- Audit/logging requirements

Don't assume implementation details. If the requirement doesn't specify, ask!
