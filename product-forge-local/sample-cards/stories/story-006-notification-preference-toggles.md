---
title: "Add per-channel notification preference toggles"
type: story
status: Draft
product: WebApp
module: Notifications
client: Acme Corp
team: Platform
parent: notification-preferences-ui
story_points: null
jira_card: null
source_conversation: null
created: 2026-02-08
updated: 2026-02-08
---

## Background / Context

The Notification Preferences UI Epic requires a settings interface where users can control which notification channels are active for each event type. Currently, TaskFlow sends all notifications through email with no user control over content or delivery. Users who want fewer notifications must disable email notifications entirely, losing visibility into all events rather than just the ones they find noisy. This all-or-nothing approach was identified in user research as the primary driver of notification fatigue, with 34% of users having disabled notifications completely.

This story delivers the foundational preferences UI: a settings page that lists all notification event types and provides per-channel toggles (email, push, in-app) for each. The preference data stored through this interface is consumed by the notification routing engine to determine which channels to activate for each notification event per user. This story focuses on the toggle interface and persistence; frequency/digest settings and notification history are addressed in Stories 007 and 008 respectively.

## Feature Requirements / Functional Behavior

### UI Behavior

- Add a "Notifications" section to the user's account settings page in the WebApp, accessible via the user profile menu.
- The preferences page displays a structured list of notification event types, organized by category (Task Events, Comment Events, Approval Events, Deadline Events, System Events). Each category can be expanded or collapsed.
- For each event type, three toggle switches are displayed in a row: Email, Push, and In-App. Each toggle can be independently turned on or off. Toggles are color-coded: enabled (blue) and disabled (gray).
- A "master toggle" at the top of each category allows users to enable or disable an entire channel for all event types in that category with a single click. Clicking the master toggle for "Push" under "Task Events" enables or disables push delivery for all task-related event types.
- A global "Pause All Notifications" toggle at the top of the page temporarily disables all notifications across all channels and event types, with a reminder banner: "Notifications are paused. You will not receive any notifications until you resume." The pause state is indicated by a visual treatment (dimmed toggles) throughout the preferences page.
- Changes are saved automatically as the user toggles each setting, with a brief confirmation toast: "Preference saved." No explicit "Save" button is needed.
- If a channel is not yet available for the user (e.g., push notifications are not registered), the toggle for that channel is disabled with a tooltip: "Enable push notifications on your device to use this channel."

### Business Rules

- New user accounts receive default notification preferences defined by the system administrator. The default configuration sends all event types through email and in-app, with push disabled until the user explicitly enables it.
- Users can configure preferences independently for each event type and channel combination. There are no forced-on event types in the initial release (this may change if an "urgent override" feature is added later).
- Preference changes take effect within 30 seconds. Notifications triggered within the propagation window may still use the previous preference state.
- The "Pause All Notifications" state is stored as a separate flag and overrides individual preferences. When the user resumes, all individual preferences are restored to their previous state.
- If all channels are disabled for an event type, no notification is sent for that event. The system does not force a default channel.
- Preference data is stored per user and is not shared with or visible to other users, including team leads or administrators.

## Acceptance Tests

**Test 1: Toggle Individual Event Type Channel**
- **Steps**:
  1. Navigate to Notification preferences in account settings.
  2. Locate the "Task Assigned" event type under Task Events.
  3. Toggle the "Push" channel from off to on.
- **Expected Result**: Toggle animates to the enabled (blue) state. Confirmation toast appears: "Preference saved." Subsequent task assignment notifications are delivered via push in addition to any other enabled channels.

**Test 2: Master Toggle for Category**
- **Steps**:
  1. Navigate to Notification preferences.
  2. Expand the "Comment Events" category.
  3. Click the master toggle for "Email" to disable email for all comment events.
- **Expected Result**: All email toggles under Comment Events switch to disabled (gray). Confirmation toast confirms the change. Individual comment event types no longer trigger email notifications.

**Test 3: Pause All Notifications**
- **Steps**:
  1. Enable "Pause All Notifications" at the top of the preferences page.
  2. Trigger a task assignment event for the user.
  3. Check all notification channels (email, push, in-app).
- **Expected Result**: No notifications are delivered on any channel. The preferences page shows a reminder banner: "Notifications are paused." All individual toggles appear dimmed. Disabling the pause restores previous preferences and resumes normal delivery.

**Test 4: Unavailable Channel Toggle Disabled**
- **Steps**:
  1. As a user who has not registered any devices for push notifications, navigate to Notification preferences.
  2. Observe the Push toggles.
- **Expected Result**: All Push toggles are disabled (grayed out) with a tooltip: "Enable push notifications on your device to use this channel."

**Test 5: New User Default Preferences**
- **Steps**:
  1. Create a new user account.
  2. Navigate to the new user's Notification preferences.
- **Expected Result**: All event types show Email and In-App toggles enabled, and Push toggles disabled. These match the system-defined default preferences.

## Implementation Context

- The preferences data model should use a flexible structure (e.g., a JSON column per user or a key-value table with composite keys of user_id + event_type + channel) that supports adding new event types without schema migrations.
- Auto-save behavior should debounce rapid toggle changes (e.g., if a user clicks 5 toggles in quick succession, batch the save into a single API call after 500ms of inactivity) to reduce API load.
- The preferences API should support both individual preference updates (for toggle changes) and bulk reads (for loading the full preferences page), with the bulk read response structured by category for efficient rendering.
- Consider caching user preferences in the notification routing engine to avoid a database lookup on every notification event. A cache TTL of 30 seconds aligns with the stated propagation delay requirement.

**Implementation Flexibility:** The technical approach is at engineering's discretion. This story defines required behaviors and outcomes; implementation details should be determined during technical design.
