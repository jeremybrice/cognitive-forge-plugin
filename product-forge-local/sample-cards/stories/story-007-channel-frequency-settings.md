---
title: "Implement frequency and digest settings per channel"
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

The Notification Preferences UI Epic includes frequency and digest settings as a key capability for reducing notification volume without sacrificing awareness. Even with per-channel toggles (Story 006), users who enable email notifications for multiple event types can receive dozens of individual emails per day, each one interrupting their workflow. User research identified that many users prefer a batched summary (digest) of lower-priority events rather than individual real-time notifications, with daily digests being the most requested frequency.

This story adds frequency controls to the notification preferences interface, allowing users to choose between real-time delivery and digest delivery on a per-channel, per-category basis. It also introduces quiet hours, a time window during which non-urgent notifications are held and included in the next digest or delivered when the quiet period ends. The digest scheduling engine on the backend batches held notifications and generates digest summary emails or in-app feed entries at the user's selected interval.

## Feature Requirements / Functional Behavior

### UI Behavior

- Extend the notification preferences page (from Story 006) with a frequency selector for each enabled channel. The selector appears as a dropdown or segmented control next to each channel toggle, with options: "Real-time" (default), "Hourly Digest", "Daily Digest", and "Weekly Digest."
- Frequency settings are available per category (Task Events, Comment Events, etc.) rather than per individual event type, to keep the preferences page manageable. If a user wants real-time delivery for task assignments but daily digest for task completions, they need to set the frequency at the category level (both event types would share the same frequency).
- A "Quiet Hours" section at the bottom of the preferences page allows users to define a daily time window during which notifications are held. The quiet hours configuration includes: enable/disable toggle, start time, end time, and timezone selector (defaulting to the user's profile timezone).
- When quiet hours are active and a notification is triggered, the system holds the notification and delivers it according to the channel's frequency setting. For real-time channels, held notifications are delivered immediately when the quiet period ends. For digest channels, held notifications are included in the next scheduled digest.
- A visual indicator on the preferences page shows the current quiet hours status: "Quiet hours active until 8:00 AM" or "Quiet hours inactive" based on the current time in the user's timezone.
- The "Weekly Digest" option includes a day-of-week selector: "Deliver weekly digest on [Monday/Tuesday/.../Sunday] at [time]."

### Business Rules

- Real-time delivery sends each notification individually as soon as it is processed by the routing engine (subject to quiet hours). This is the default frequency for all channels.
- Digest delivery batches all notifications for a category and channel into a single summary notification delivered at the scheduled interval. Hourly digests are sent at the top of each hour. Daily digests are sent at a user-configurable time (default: 8:00 AM in the user's timezone). Weekly digests are sent at the user-selected day and time.
- If no notifications have been generated during a digest interval, no digest is sent. Empty digests are suppressed.
- Quiet hours apply to all channels except notifications categorized as "System Alerts" (e.g., password reset confirmations, security alerts), which are always delivered in real-time regardless of quiet hours or frequency settings.
- Digest emails include a summary header showing the count of notifications by event type, followed by a chronological list of notifications with brief details and links to the full context in the WebApp.
- Frequency and quiet hours settings are independent per user. There are no organization-wide frequency policies in the initial release.
- When a user changes their frequency setting from "Real-time" to a digest option, any notifications already in the pipeline continue to deliver in real-time. The new frequency applies to notifications triggered after the change.

## Acceptance Tests

**Test 1: Set Daily Digest for Email on Comment Events**
- **Steps**:
  1. Navigate to Notification preferences.
  2. Under "Comment Events," set the Email frequency to "Daily Digest."
  3. Trigger 5 comment notifications for the user over the next few hours.
  4. Wait for the daily digest delivery time.
- **Expected Result**: No individual comment emails are received during the day. At the daily digest time, a single digest email is delivered containing summaries of all 5 comment notifications with links to each comment.

**Test 2: Empty Digest Suppression**
- **Steps**:
  1. Set Email frequency for "Approval Events" to "Daily Digest."
  2. Do not trigger any approval notifications during the digest period.
  3. Wait for the daily digest delivery time.
- **Expected Result**: No digest email is sent for the approval category. The user does not receive an empty "You have no notifications" email.

**Test 3: Quiet Hours Hold and Release**
- **Steps**:
  1. Configure quiet hours from 10:00 PM to 8:00 AM.
  2. Trigger a real-time task assignment notification at 11:00 PM.
  3. Observe notification delivery.
- **Expected Result**: The notification is not delivered at 11:00 PM. It is delivered at 8:00 AM when quiet hours end. The notification contains the original content and timestamp.

**Test 4: System Alerts Bypass Quiet Hours**
- **Steps**:
  1. Configure quiet hours from 10:00 PM to 8:00 AM.
  2. Trigger a password reset confirmation (System Alert) at 11:00 PM.
- **Expected Result**: The password reset notification is delivered immediately at 11:00 PM, bypassing quiet hours. Real-time delivery behavior is maintained for System Alerts regardless of quiet hours or frequency settings.

**Test 5: Weekly Digest Day and Time Selection**
- **Steps**:
  1. Set the frequency for "Task Events" email to "Weekly Digest."
  2. Select "Monday" at "9:00 AM" as the delivery schedule.
  3. Trigger various task notifications throughout the week.
- **Expected Result**: A single weekly digest email is delivered on Monday at 9:00 AM containing all task notifications from the past week. No individual task emails are sent during the week.

**Test 6: Timezone-Aware Digest and Quiet Hours**
- **Steps**:
  1. Set the user's timezone to "US/Pacific" (UTC-8).
  2. Configure daily digest at 8:00 AM and quiet hours from 10:00 PM to 7:00 AM.
  3. Trigger notifications at various times.
- **Expected Result**: All digest and quiet hours times are evaluated in the user's Pacific timezone, not UTC or server time. A notification triggered at 6:00 AM Pacific is held during quiet hours and delivered at 7:00 AM Pacific.

## Implementation Context

- The digest scheduling engine should use a job scheduler (cron-based or event-driven) that can handle per-user scheduling with timezone awareness. Consider grouping users by timezone to batch digest generation efficiently rather than scheduling a separate job per user.
- Digest email rendering should reuse the notification template system from Story 001, with a dedicated "digest" template type that supports iterating over a collection of notification summaries.
- Quiet hours evaluation should occur at the notification routing layer, before channel dispatch. Held notifications should be stored in a "held" queue with a scheduled release time, not silently dropped and regenerated.
- DST (Daylight Saving Time) transitions must be handled correctly. A user with quiet hours ending at 8:00 AM should have their notifications released at 8:00 AM local time regardless of DST changes. Use a timezone-aware datetime library rather than offset-based calculations.

**Implementation Flexibility:** The technical approach is at engineering's discretion. This story defines required behaviors and outcomes; implementation details should be determined during technical design.
