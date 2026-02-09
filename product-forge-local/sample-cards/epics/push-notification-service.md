---
title: "Push Notification Service"
type: epic
status: Planning
product: MobileApp
module: Notifications
client: Acme Corp
team: Platform
parent: notification-system-overhaul
children:
  - story-004-push-notification-registration
  - story-005-push-payload-formatting
description: "Build push notification capability for MobileApp and WebApp browser push, including device registration, payload formatting, and delivery through FCM and APNs."
source_intake: null
source_conversation: null
created: 2026-02-08
updated: 2026-02-08
---

## Background/Context

The Notification System Overhaul Initiative requires push notifications as a real-time delivery channel alongside email and in-app feeds. Enterprise clients, especially Acme Corp, have identified push notifications as critical for time-sensitive events like task assignments, approval requests, and deadline alerts. The current email-only delivery introduces minutes to hours of latency between an event occurring and the user becoming aware of it, which is unacceptable for workflows that require immediate attention.

This Epic builds on the delivery pipeline architecture established in the Email Notification Engine Epic, extending the notification platform to support native push notifications on iOS (APNs) and Android (FCM), as well as browser push notifications for WebApp users. The push notification service operates as a parallel delivery channel, receiving notification events from the central notification bus and routing them to registered devices based on user preferences and device capabilities.

## Epic Scope

This Epic delivers two core capabilities: a device registration system that manages push notification tokens for user devices across platforms, and a payload formatting and delivery service that transforms notification events into platform-appropriate push payloads and dispatches them through the correct push provider. The device registration system handles token creation, refresh, expiration, and multi-device scenarios where a single user has tokens registered for multiple devices. The payload formatter adapts notification content to each platform's constraints and capabilities, including character limits, action buttons, rich media attachments, and deep linking to specific screens within the MobileApp.

The scope covers the server-side push notification infrastructure, the MobileApp device registration flows for iOS and Android, and the WebApp service worker setup for browser push. Excluded from this Epic: the user notification preferences UI (covered by the Notification Preferences UI Epic), the notification event bus and routing logic (cross-cutting platform work), and in-app notification display within the MobileApp.

## Affected Systems

- Notification Service (primary: push delivery pipeline, device token management, payload formatting engine)
- MobileApp (primary: device registration flows for iOS and Android, push notification display and deep linking)
- WebApp (primary: browser push service worker registration, push notification display)
- Database (primary: device token registry, push delivery tracking)
- API Gateway (secondary: device registration API endpoints)

## Functional Capabilities

- Register device push tokens when users install or open the MobileApp, handling platform-specific flows for iOS (APNs token via user permission prompt) and Android (FCM token via automatic registration), with token refresh on app updates or OS-level token rotation.
- Maintain a device registry that maps users to their registered devices, supporting multiple devices per user and automatic cleanup of stale tokens when push deliveries return invalid-token errors.
- Format notification payloads according to platform requirements: APNs alert format for iOS, FCM message format for Android, and Web Push API format for browsers, respecting each platform's character limits, media attachment capabilities, and action button constraints.
- Deliver push notifications through the appropriate provider (APNs for iOS, FCM for Android, Web Push for browsers) with delivery tracking that records dispatch status and provider response.
- Support deep linking in push notification payloads so that tapping a notification opens the MobileApp directly to the relevant screen (e.g., tapping a task assignment notification opens the task detail view).

## Suggested Story Breakdown

- Implement device registration for push notifications covering iOS APNs token acquisition, Android FCM token registration, WebApp service worker setup, multi-device management, and stale token cleanup.
- Build push payload formatting and delivery service that transforms notification events into platform-specific payloads, dispatches through the correct provider, and records delivery status.

## Success Criteria

- Users who enable push notifications on their devices receive push delivery within 5 seconds of the notification event being published.
- Device registration handles multi-device scenarios correctly: a notification triggers push delivery to all registered devices for the target user.
- Stale tokens are detected and cleaned up automatically when providers return invalid-token responses, preventing wasted delivery attempts.
- Push payloads render correctly on iOS 15+, Android 12+, and current versions of Chrome, Firefox, and Safari for browser push.
- Deep links in push notifications correctly navigate users to the relevant screen in the MobileApp.

## Related Epics/Dependencies

- Depends on: Email Notification Engine Epic (reuses the delivery pipeline architecture and provider abstraction pattern)
- Related: Notification Preferences UI Epic (users control push notification preferences through the preferences UI)
- Depends on: MobileApp push notification permission flows (requires OS-level permission prompts to be implemented in MobileApp)

## Technical Constraints

- APNs requires a paid Apple Developer account and per-app push certificate or key; certificate rotation must be handled without service interruption.
- FCM requires a Firebase project with Cloud Messaging enabled; the server key must be stored securely and rotated according to Google's recommended schedule.
- Browser push (Web Push API) requires a VAPID key pair and a service worker registered in the WebApp; this service worker must not conflict with any existing service workers.
- Push notification payloads have strict size limits: 4KB for APNs, 4KB for FCM, and varies by browser for Web Push. The payload formatter must enforce these limits and truncate content gracefully.
- Device token storage must comply with privacy regulations; tokens are considered personal data in some jurisdictions and must be deleted when a user deletes their account.

## Open Questions

- Should push notifications support rich media (images, action buttons) in the initial release, or should the first version be text-only with rich media added later?
- What is the desired behavior when a user has push enabled on 5+ devices? Should all devices receive every notification, or should there be a device limit?
- Should the system support silent/background push notifications for data sync purposes, or only user-visible alert notifications?
- How should the push service handle provider outages (e.g., APNs is down)? Queue and retry, or drop with logging?
