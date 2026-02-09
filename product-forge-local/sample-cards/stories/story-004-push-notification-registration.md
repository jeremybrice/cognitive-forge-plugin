---
title: "Device registration for push notifications"
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

The Push Notification Service Epic requires a device registration system that manages push notification tokens across iOS, Android, and web browser platforms. Before any push notification can be delivered, the user's device must register its push token with the TaskFlow backend, and that token must be stored in a device registry that maps users to their registered devices. Without reliable device registration, push notifications cannot be targeted to the correct devices, and stale or invalid tokens waste delivery resources and generate provider errors.

This story establishes the device registration infrastructure that the push payload formatting and delivery service (Story 005) depends on. The registration system must handle the full token lifecycle: initial registration when a user enables push, token refresh when the operating system rotates tokens, multi-device support for users who access TaskFlow from multiple devices, and automatic cleanup of stale tokens when they are no longer valid. The registration flow differs by platform (iOS requires explicit user permission, Android registers automatically, browsers require service worker setup), so the implementation must accommodate platform-specific behaviors while presenting a unified API to the backend.

## Feature Requirements / Functional Behavior

### UI Behavior

- On the MobileApp (iOS), when a user first opens the app after installation, a system permission prompt asks: "TaskFlow would like to send you notifications." If the user grants permission, the device token is acquired from APNs and sent to the backend registration endpoint. If denied, a banner in the app settings explains how to enable notifications through device settings.
- On the MobileApp (Android), push notification registration occurs automatically without a user permission prompt (per Android's default behavior for FCM). The FCM token is acquired on app startup and sent to the backend registration endpoint.
- On the WebApp, a prompt appears on first login (or after dismissal cooldown of 7 days): "Enable desktop notifications to stay updated on task changes." Clicking "Enable" triggers the browser's native notification permission request and, if granted, registers a service worker and acquires a Web Push token.
- In the user's account settings (both MobileApp and WebApp), a "Registered Devices" section lists all devices registered for push notifications, showing device name, platform, registration date, and last active date. Users can remove individual devices from this list, which deregisters the push token.
- When a push token is refreshed by the operating system, the app silently re-registers the new token with the backend without any user interaction or notification.

### Business Rules

- Each device is uniquely identified by a combination of platform (iOS, Android, Web) and a device fingerprint (device ID for mobile, browser fingerprint for web). Re-registering the same device updates the existing token rather than creating a duplicate entry.
- A single user can have up to 10 registered devices. If a user attempts to register an 11th device, the oldest registered device (by last active date) is automatically deregistered to make room.
- Stale token cleanup occurs in two ways: proactively when a push delivery returns an "invalid token" or "unregistered" error from the provider (the token is immediately removed from the registry), and passively via a scheduled job that removes tokens for devices with no activity in the past 90 days.
- When a user logs out of a device, the push token for that device is deregistered from the backend. When the user logs back in, a new registration is initiated.
- Token data is treated as personal data under privacy regulations. When a user deletes their account, all associated push tokens are permanently deleted from the registry within 24 hours.

## Acceptance Tests

**Test 1: iOS Device Registration with Permission Grant**
- **Steps**:
  1. Install the MobileApp on an iOS device.
  2. Open the app for the first time.
  3. Grant notification permission when prompted.
  4. Check the backend device registry.
- **Expected Result**: The device appears in the registry with the correct APNs token, platform "iOS", device name, and registration timestamp. The user's Registered Devices list in account settings shows the device.

**Test 2: Android Device Automatic Registration**
- **Steps**:
  1. Install the MobileApp on an Android device.
  2. Open the app and log in.
  3. Check the backend device registry.
- **Expected Result**: The device appears in the registry with the correct FCM token, platform "Android", device name, and registration timestamp without any permission prompt.

**Test 3: Web Browser Push Registration**
- **Steps**:
  1. Log in to the WebApp in Chrome.
  2. Click "Enable" on the desktop notification prompt.
  3. Grant the browser notification permission.
  4. Check the backend device registry.
- **Expected Result**: The browser appears in the registry with a Web Push token, platform "Web", browser identifier, and registration timestamp.

**Test 4: Multi-Device Registration Limit**
- **Steps**:
  1. Register push tokens from 10 different devices for a single user.
  2. Register an 11th device.
  3. Check the device registry.
- **Expected Result**: The 11th device is registered successfully. The oldest device (by last active date) is automatically deregistered. The registry contains exactly 10 entries for the user.

**Test 5: Stale Token Cleanup on Invalid Token Response**
- **Steps**:
  1. Register a device and record its token.
  2. Send a push notification that returns an "invalid token" response from the provider.
  3. Check the device registry.
- **Expected Result**: The invalid token is immediately removed from the registry. The device no longer appears in the user's Registered Devices list.

**Test 6: Logout Deregistration**
- **Steps**:
  1. Register a device for push notifications.
  2. Log out of the app on that device.
  3. Check the backend device registry.
- **Expected Result**: The push token for that device is removed from the registry. Logging back in initiates a new registration with a potentially new token.

## Implementation Context

- The device registration API endpoint should accept a platform identifier, push token, and device metadata, returning a registration confirmation with a device ID that can be used for future management operations.
- Token storage should be encrypted at rest, as push tokens can be used to send notifications to specific devices and are considered sensitive data.
- The service worker for WebApp browser push must be registered at the root scope of the application to ensure it can intercept push events. Coordinate with the frontend team to avoid conflicts with any existing service workers (e.g., for offline caching).
- Consider using a background job framework for the 90-day stale token cleanup rather than a database trigger or cron job, to ensure the cleanup is observable, retryable, and does not lock the device registry table during execution.

**Implementation Flexibility:** The technical approach is at engineering's discretion. This story defines required behaviors and outcomes; implementation details should be determined during technical design.
