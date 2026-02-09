---
title: "WebApp Release 260208"
type: release-notes
product: WebApp
version: "webapp-260208"
release_date: 2026-02-08
created: 2026-02-08
updated: 2026-02-08
---

## What's New

- **Notification Preferences Page**: Users can now manage their notification settings from a dedicated "Notifications" section in account settings. Per-channel toggles (email, push, in-app) are available for each notification event type, giving users granular control over which events trigger notifications and through which channels. A "Pause All Notifications" toggle temporarily disables all notification delivery.

- **Notification History View**: A new notification bell icon in the global navigation bar provides quick access to recent notifications. Clicking the bell shows the 20 most recent notifications in a dropdown panel, with an option to view the full notification history on a dedicated page. The history view supports filtering by event type and read/unread status, and notifications are retained for 90 days.

- **Email Notification Template Builder**: Product teams can now create and edit email notification templates through an admin interface without engineering involvement. The template builder supports dynamic content variables, conditional sections, and a live preview with sample data. Templates are versioned automatically, and a "Preview Email" feature sends a test rendering to the admin's inbox.

## Improvements

- **Email Delivery Reliability**: Email notifications are now processed through a new delivery pipeline with automatic retry for transient failures. Failed deliveries are retried up to 3 times with exponential backoff before being routed to a dead letter queue for manual review. Provider failover ensures that if the primary email provider is experiencing issues, notifications automatically route through the backup provider.

- **Notification Delivery Tracking**: Every email notification now has end-to-end delivery tracking, recording status transitions from queued through delivered or failed. The admin notification dashboard shows delivery status for individual notifications, retry attempts, and overall delivery success rates.

- **Bulk Notification Performance**: A new bulk notification API endpoint supports sending notifications to up to 10,000 recipients in a single request with asynchronous processing and progress tracking. This replaces the previous approach of triggering individual notification events in a loop, reducing processing time for large sends by over 90%.

## Bug Fixes

- Fixed an issue where email notifications sent during high-traffic periods could be silently dropped without any error logging or retry attempt. The new delivery pipeline ensures all send failures are captured and retried.

- Resolved a rendering inconsistency where notification emails displayed differently in Outlook compared to Gmail due to inconsistent CSS inlining. The template engine now applies consistent CSS inlining across all templates.

- Fixed a timing issue where notifications triggered within the same second as a task status change could reference the old status value instead of the new one. Notification event publishing now occurs after the database transaction commits.

- Corrected the notification dropdown panel's scroll behavior on Safari, where the panel would not scroll properly when more than 10 notifications were displayed. The panel now scrolls correctly on all supported browsers.
