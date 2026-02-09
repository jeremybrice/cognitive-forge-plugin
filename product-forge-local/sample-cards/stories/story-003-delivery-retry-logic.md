---
title: "Add retry logic for failed email deliveries"
type: story
status: Draft
product: WebApp
module: Notifications
client: Acme Corp
team: Platform
parent: email-notification-engine
story_points: null
jira_card: null
source_conversation: null
created: 2026-02-08
updated: 2026-02-08
---

## Background / Context

The Email Notification Engine Epic requires automatic retry logic for failed email deliveries to improve overall delivery reliability. The current email system has no retry mechanism: when a send attempt fails for any reason (network timeout, provider rate limit, temporary server error), the notification is permanently lost. Analysis of provider logs from the past quarter indicates that approximately 4% of send attempts fail on the first try, but over 90% of those failures are transient and would succeed on a subsequent attempt. This means the platform is permanently losing notifications that could be recovered with basic retry logic.

This story adds an intelligent retry mechanism to the delivery pipeline built in Story 002. The retry system distinguishes between transient failures (worth retrying) and permanent failures (not worth retrying), applies exponential backoff with jitter to avoid overwhelming a recovering provider, and routes notifications to a dead letter queue after all retry attempts are exhausted so they can be reviewed and manually resolved by the Platform team.

## Feature Requirements / Functional Behavior

### UI Behavior

- The admin notification dashboard displays retry status for failed notifications: "Retrying (attempt 2 of 3)", "Retrying (attempt 3 of 3)", or "Failed (moved to dead letter queue)."
- A "Dead Letter Queue" section in the admin dashboard lists all notifications that have exhausted their retry attempts, showing the notification details, failure reason, number of attempts made, and timestamps of each attempt.
- Each entry in the dead letter queue provides two action buttons: "Retry Now" (manually re-enqueue for another delivery attempt) and "Discard" (mark as permanently failed and remove from the queue).
- A summary widget on the admin dashboard shows retry metrics: notifications currently in retry, notifications in the dead letter queue, and the overall delivery success rate (including retries) for the past 24 hours.

### Business Rules

- Retry is triggered automatically when a send attempt returns a transient failure. Transient failures include: network timeouts, HTTP 429 (rate limited), HTTP 500/502/503/504 (server errors), and connection refused errors.
- Permanent failures do not trigger retry. Permanent failures include: HTTP 400 (bad request / invalid recipient), HTTP 401/403 (authentication failure), hard bounces (invalid email address), and spam complaints.
- The default retry configuration is 3 attempts with exponential backoff: first retry after 1 minute, second retry after 5 minutes, third retry after 15 minutes. Jitter of up to 30 seconds is added to each backoff interval to prevent retry storms.
- Retry configuration is adjustable per notification template through the template builder. Templates for high-priority event types can be configured with higher retry limits (up to 5 attempts) or shorter backoff intervals.
- After all retry attempts are exhausted, the notification is moved to the dead letter queue and an alert is published to the Platform team's monitoring channel.
- Dead letter queue entries are retained for 30 days. Entries older than 30 days are automatically purged.

## Acceptance Tests

**Test 1: Automatic Retry on Transient Failure**
- **Steps**:
  1. Trigger a notification event.
  2. Simulate the provider returning HTTP 503 on the first send attempt.
  3. Allow the retry timer to fire.
  4. Simulate the provider returning success on the second attempt.
- **Expected Result**: Notification is delivered on the second attempt. Admin dashboard shows the notification transitioning from "Retrying (attempt 2 of 3)" to "Delivered." Delivery tracking records both attempts with timestamps.

**Test 2: Exponential Backoff Timing**
- **Steps**:
  1. Trigger a notification that fails on all attempts.
  2. Record the timestamps of each retry attempt.
- **Expected Result**: Second attempt occurs approximately 1 minute after the first. Third attempt occurs approximately 5 minutes after the second. Fourth attempt (if configured) occurs approximately 15 minutes after the third. Each interval includes jitter of up to 30 seconds.

**Test 3: Permanent Failure Does Not Retry**
- **Steps**:
  1. Trigger a notification to an invalid email address.
  2. Observe the delivery pipeline behavior.
- **Expected Result**: The send attempt fails with a hard bounce (permanent failure). No retry is scheduled. Notification is immediately moved to the dead letter queue with the failure reason recorded.

**Test 4: Dead Letter Queue Manual Retry**
- **Steps**:
  1. Navigate to the Dead Letter Queue in the admin dashboard.
  2. Select a failed notification entry.
  3. Click "Retry Now."
- **Expected Result**: The notification is re-enqueued for delivery with a fresh set of retry attempts. It is removed from the dead letter queue. If delivery succeeds, status updates to "Delivered."

**Test 5: Dead Letter Queue Discard**
- **Steps**:
  1. Navigate to the Dead Letter Queue.
  2. Select a failed notification entry.
  3. Click "Discard."
- **Expected Result**: The notification is marked as "Permanently Failed" and removed from the dead letter queue. It no longer appears in active queues. The discard action is recorded in the audit log.

**Test 6: Retry Metrics on Admin Dashboard**
- **Steps**:
  1. Generate a mix of successful, retried, and failed notifications over a 24-hour period.
  2. View the retry metrics summary widget on the admin dashboard.
- **Expected Result**: Widget displays accurate counts for notifications currently in retry, notifications in the dead letter queue, and the overall success rate including retries. Metrics update within 60 seconds of status changes.

## Implementation Context

- The retry mechanism should be implemented within the message queue infrastructure used by the delivery pipeline (Story 002). Most message queue systems support delayed re-delivery or scheduled messages natively, which can be leveraged for the backoff intervals.
- Jitter implementation should use a random value uniformly distributed between 0 and the maximum jitter interval, added to the calculated backoff delay.
- The dead letter queue should be a separate queue (not a database table masquerading as a queue) to ensure it can be processed independently and does not affect the performance of the main delivery queue.
- Monitoring alerts for dead letter queue entries should integrate with the team's existing alerting infrastructure (PagerDuty, Slack, or equivalent).

**Implementation Flexibility:** The technical approach is at engineering's discretion. This story defines required behaviors and outcomes; implementation details should be determined during technical design.
