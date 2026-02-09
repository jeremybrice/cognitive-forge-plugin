---
title: "Format and send push notification payloads"
type: story
status: Draft
product: MobileApp
module: Notifications
client: Acme Corp
team: Platform
parent: push-notification-service
story_points: null
jira_card: null
source_conversation: null
created: 2026-02-08
updated: 2026-02-08
---

## Background / Context

The Push Notification Service Epic requires a payload formatting and delivery service that transforms notification events into platform-appropriate push payloads and dispatches them to registered devices through the correct push provider. Each push notification platform (APNs for iOS, FCM for Android, Web Push API for browsers) has distinct payload formats, size constraints, and feature capabilities. A task assignment notification, for example, must be formatted differently for each platform while conveying the same essential information and providing the correct deep link to the task detail screen.

This story builds on the device registration system (Story 004), which provides the token registry used to determine which devices should receive a push notification for a given user. The payload formatter consumes notification events from the central notification bus, resolves the target user's registered devices, formats a platform-appropriate payload for each device, and dispatches the payloads through the corresponding push provider.

## Feature Requirements / Functional Behavior

### UI Behavior

- Push notifications appear as native OS notifications on the recipient's device: as a banner/alert on iOS, as a notification in the notification shade on Android, and as a browser notification popup on desktop.
- Each push notification displays a title (the event type, e.g., "Task Assigned"), a body (a short summary, e.g., "Project Alpha: Design review has been assigned to you"), and the TaskFlow app icon.
- Tapping a push notification on mobile opens the MobileApp and deep links to the relevant screen. For example, tapping a task assignment notification opens the task detail view for the assigned task. If the app is not running, it launches and navigates to the target screen after startup.
- Clicking a browser push notification opens or focuses the WebApp browser tab and navigates to the relevant page.
- If a notification cannot include all relevant information within platform payload limits, the body is truncated with an ellipsis and the full content is available when the user opens the notification's target screen.

### Business Rules

- Payload size must not exceed platform limits: 4KB for APNs, 4KB for FCM data messages, and 4KB for Web Push (browser-dependent). The formatter must calculate payload size before dispatch and truncate content fields if necessary to stay within limits.
- Push notifications are sent to all registered devices for the target user. If a user has 3 registered devices (iPhone, Android tablet, Chrome browser), all 3 receive the notification.
- The push delivery service records the dispatch status for each device: Sent (accepted by the provider), Failed (rejected by the provider), or Skipped (no valid token for the platform). These statuses are stored in the delivery tracking system.
- Deep link URLs are formatted according to each platform's convention: custom URL schemes or Universal Links for iOS, Intent URIs or App Links for Android, and standard HTTPS URLs for web.
- Push notifications include a notification category/channel identifier that the OS uses to group and prioritize notifications. TaskFlow defines categories for: Task Updates, Comments, Approvals, Deadlines, and System Alerts.
- If a user has notification preferences configured (from the Notification Preferences UI Epic), the push delivery service respects those preferences. If preferences are not yet available (before that Epic is complete), all event types are delivered via push by default.

## Acceptance Tests

**Test 1: Deliver Push Notification to iOS Device**
- **Steps**:
  1. Trigger a task assignment event for a user with a registered iOS device.
  2. Observe the push notification on the iOS device.
- **Expected Result**: A push notification appears as a banner on the iOS device with the correct title ("Task Assigned"), body (task name and project), and TaskFlow app icon. Tapping the notification opens the MobileApp to the task detail screen.

**Test 2: Deliver Push Notification to Android Device**
- **Steps**:
  1. Trigger a comment notification for a user with a registered Android device.
  2. Observe the push notification in the Android notification shade.
- **Expected Result**: A notification appears in the notification shade with the correct title, body, and icon. The notification is grouped under the "Comments" channel. Tapping opens the MobileApp to the relevant task's comment section.

**Test 3: Multi-Device Delivery**
- **Steps**:
  1. Register push tokens for a user on 3 devices: iOS phone, Android tablet, and Chrome browser.
  2. Trigger a deadline notification for that user.
- **Expected Result**: All 3 devices receive the push notification within 5 seconds. Each device's notification is formatted according to its platform's requirements. Delivery tracking shows "Sent" status for all 3 devices.

**Test 4: Payload Size Enforcement**
- **Steps**:
  1. Trigger a notification with a very long task title and description (exceeding 4KB when fully formatted).
  2. Observe the delivered push notification.
- **Expected Result**: The push notification is delivered successfully. The body text is truncated with an ellipsis to fit within the platform's payload limit. The full content is accessible when the user opens the linked screen.

**Test 5: Deep Link Navigation from Cold Start**
- **Steps**:
  1. Force-close the MobileApp.
  2. Receive a push notification for a task assignment.
  3. Tap the notification.
- **Expected Result**: The MobileApp launches and, after initialization, navigates directly to the assigned task's detail screen rather than the home screen.

## Implementation Context

- The payload formatter should use a strategy pattern with platform-specific formatter implementations (APNsFormatter, FCMFormatter, WebPushFormatter) that share a common interface. This allows adding new platforms (e.g., Huawei Push Kit) without modifying existing formatters.
- Deep link URL construction should be centralized in a URL builder utility that generates the correct link format based on the target platform and the notification's context (entity type, entity ID, action).
- FCM supports both "notification" messages (handled by the OS) and "data" messages (handled by the app). Using data messages provides more control over notification display and deep linking behavior, at the cost of requiring in-app notification handling code.
- Push delivery is inherently fire-and-forget from the provider perspective; delivery confirmation (e.g., "the notification was actually displayed on the device") is not reliably available. Tracking should focus on dispatch status (accepted/rejected by provider) rather than delivery confirmation.

**Implementation Flexibility:** The technical approach is at engineering's discretion. This story defines required behaviors and outcomes; implementation details should be determined during technical design.
