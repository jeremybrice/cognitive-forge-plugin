---
title: "Build notification history view for users"
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

The Notification Preferences UI Epic includes a notification history view as the third core capability, complementing the preference toggles (Story 006) and frequency settings (Story 007). Users have consistently requested a centralized place to review past notifications, particularly when they return from time away (vacation, sick leave, quiet hours) and need to catch up on what they missed. Currently, the only way to review past notifications is to search through email, which is unreliable because users may have deleted notification emails, marked them as spam, or disabled email notifications entirely.

This story delivers an in-app notification history feed accessible from the WebApp that shows all notifications a user has received across all channels in reverse chronological order. The history view serves as both a catch-up tool and a reference archive, with read/unread tracking, event type filtering, and the ability to navigate directly to the source context (task, comment, approval, etc.) from any notification entry.

## Feature Requirements / Functional Behavior

### UI Behavior

- Add a notification bell icon to the WebApp's global navigation bar. The bell displays an unread count badge showing the number of unread notifications (capped at "99+" for counts exceeding 99).
- Clicking the bell icon opens a notification panel (dropdown or slide-out panel) showing the most recent 20 notifications in reverse chronological order. Each entry displays: event type icon, notification title, brief body text (truncated to 2 lines), relative timestamp ("2 minutes ago", "Yesterday at 3:45 PM"), and a read/unread indicator (bold text for unread, normal weight for read).
- A "View All" link at the bottom of the dropdown panel navigates to a full-page notification history view with the complete notification list, advanced filtering, and pagination.
- The full-page notification history view provides filters: event type category (Task Events, Comment Events, Approval Events, Deadline Events, System Events), read/unread status, and date range. Filters can be combined and are applied immediately.
- Clicking any notification entry navigates to the source context: a task assignment notification navigates to the task detail page, a comment notification navigates to the comment thread, an approval notification navigates to the approval request. The notification is automatically marked as read when clicked.
- A "Mark All as Read" button at the top of the notification list marks all visible notifications as read in a single action. A confirmation toast appears: "All notifications marked as read."
- Individual notifications can be marked as read or unread by clicking a status indicator (dot or checkbox) on the notification entry, without navigating to the source context.

### Business Rules

- The notification history includes notifications from all channels (email, push, in-app). If a notification was sent via email and push, it appears as a single entry in the history (not duplicated per channel). The entry indicates which channels were used for delivery.
- Notification history is retained for 90 days. Notifications older than 90 days are automatically removed from the history view. Users are not notified when old notifications are purged.
- Read/unread status is synchronized across devices. If a user reads a notification on the MobileApp (tapping a push notification), the corresponding entry in the WebApp notification history is also marked as read within 30 seconds.
- The unread count badge in the navigation bar updates in near-real-time (within 5 seconds) when a new notification is received or when a notification is marked as read, without requiring a page refresh. This requires a WebSocket or polling mechanism.
- Notifications are grouped by date in the full-page view: "Today", "Yesterday", and then by calendar date for older entries.
- When a notification references an entity that has been deleted (e.g., a task that was removed), the notification entry is still displayed but the navigation link is disabled with a tooltip: "This item is no longer available."

## Acceptance Tests

**Test 1: Unread Count Badge Updates in Real-Time**
- **Steps**:
  1. Open the WebApp with 0 unread notifications.
  2. Trigger 3 task assignment notifications for the user from another session.
  3. Observe the notification bell without refreshing the page.
- **Expected Result**: The unread count badge appears and increments from 1 to 3 within 5 seconds of each notification being processed. No page refresh is needed.

**Test 2: Navigate to Source Context from Notification**
- **Steps**:
  1. Click the notification bell to open the dropdown panel.
  2. Click on a "Comment Added" notification entry.
- **Expected Result**: The browser navigates to the comment thread on the relevant task. The notification is automatically marked as read. The unread count badge decreases by 1.

**Test 3: Filter Notifications by Event Type and Status**
- **Steps**:
  1. Navigate to the full-page notification history.
  2. Apply filter: Event Type = "Approval Events" and Status = "Unread."
- **Expected Result**: Only unread approval-related notifications are displayed. Other event types and read notifications are hidden. Clearing the filters restores the full list.

**Test 4: Mark All as Read**
- **Steps**:
  1. Ensure there are 15 unread notifications.
  2. Click "Mark All as Read" on the notification history page.
- **Expected Result**: All 15 notifications change to read status. The unread count badge in the navigation bar updates to 0. Confirmation toast: "All notifications marked as read."

**Test 5: Cross-Device Read Status Sync**
- **Steps**:
  1. Receive a push notification on a mobile device.
  2. Tap the push notification on the mobile device (marking it as read).
  3. Open the WebApp notification history on a desktop browser.
- **Expected Result**: The corresponding notification entry in the WebApp history shows as read. The unread count badge reflects the updated status.

**Test 6: Deleted Entity Handling**
- **Steps**:
  1. Receive a notification about a task comment.
  2. Delete the task that the comment belongs to.
  3. Open the notification history and locate the comment notification.
- **Expected Result**: The notification entry is still visible in the history. The notification title and body are preserved. The navigation link is disabled with a tooltip: "This item is no longer available."

## Implementation Context

- The notification bell badge and dropdown panel should use a WebSocket connection or Server-Sent Events for real-time updates. If WebSocket infrastructure is not available, fall back to polling every 5 seconds. The chosen approach should be coordinated with the frontend architecture team.
- The notification history API should use cursor-based pagination (not offset-based) to handle the high volume of notifications for active users efficiently. The initial page load should return the 20 most recent notifications, with subsequent pages loaded on scroll or "Load More" interaction.
- Read/unread status synchronization across devices requires a central status store that both WebApp and MobileApp update. Consider using the notification delivery tracking table as the source of truth for read status, with the MobileApp updating it via API when a push notification is tapped.
- The 90-day retention cleanup should be handled by a scheduled background job that runs during low-traffic hours to minimize database load. Cleanup should be batched (delete in chunks of 1,000) to avoid long-running transactions.

**Implementation Flexibility:** The technical approach is at engineering's discretion. This story defines required behaviors and outcomes; implementation details should be determined during technical design.
