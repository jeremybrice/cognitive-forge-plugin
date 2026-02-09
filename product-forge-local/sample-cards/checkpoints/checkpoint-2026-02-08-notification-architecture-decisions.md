---
title: "Notification Architecture Design Session"
type: checkpoint
source: Architecture Review Meeting
participants:
  - Platform Tech Lead
  - Senior Backend Engineer
  - Frontend Lead
  - Product Lead
created: 2026-02-08
updated: 2026-02-08
---

## Summary

The Platform team conducted an architecture design session to evaluate approaches for the Notification System Overhaul. The session focused on three key decisions: the overall notification pipeline architecture, the provider abstraction strategy, and the approach for real-time notification delivery to the WebApp. The team reached consensus on an event-driven pipeline using a message bus, a strategy pattern for provider abstraction, and WebSocket connections for real-time in-app notifications.

## Key Points

- The current notification system is a synchronous, inline email sender embedded in the application layer. Every notification-triggering action (task assignment, comment creation, etc.) directly calls the email sending function, which blocks the application thread until the send completes or times out. This is the root cause of both delivery reliability issues and application performance degradation during high-notification-volume periods.

- The team evaluated three architecture options: (1) keep the synchronous model but add retry and failover, (2) move to an asynchronous queue-based model with a dedicated notification worker, (3) build a fully event-driven pipeline with a message bus. Option 1 was rejected as a short-term patch that would not support multi-channel delivery. Option 2 was considered viable but less extensible. Option 3 was selected for its ability to decouple event producers from notification consumers and to support adding new channels without modifying upstream services.

- For provider abstraction, the team evaluated building a custom abstraction layer versus using an existing notification aggregation service (e.g., Novu, Courier). The team decided on a custom abstraction layer because the notification requirements are well-defined, the team has the expertise to build it, and relying on a third-party service introduces a dependency that could affect delivery reliability. The custom layer will use a strategy pattern where each provider implements a common interface.

- Real-time in-app notification delivery was debated between WebSocket connections and Server-Sent Events (SSE). The team chose WebSockets because the WebApp already uses WebSocket infrastructure for another feature (real-time task board updates), making it operationally simpler to extend rather than introduce a new transport mechanism.

- The message bus technology discussion compared RabbitMQ, Amazon SQS, and Redis Streams. No final decision was made during the session; the Senior Backend Engineer will evaluate all three against the requirements (at-least-once delivery, delayed messages for retry backoff, dead letter queue support) and present a recommendation at the next technical review.

## Decisions and Conclusions

- The notification pipeline will use an event-driven architecture with a message bus. Application services publish notification events to the bus, and channel-specific consumer services subscribe to the bus and handle delivery through their respective providers.

- Provider abstraction will be implemented using a custom strategy pattern. Each email provider (SendGrid, Amazon SES) will implement a common ProviderInterface with methods for sending, checking status, and validating credentials. Push providers (FCM, APNs) will follow the same pattern.

- Real-time in-app notifications will be delivered through the existing WebSocket infrastructure, with a new notification channel added to the WebSocket message schema.

- The notification template engine will use Handlebars as the templating language, selected for its wide adoption, security features (auto-escaping), and support for conditional blocks and iteration that the template builder requires.

## Open Items

- Message bus technology selection: the Senior Backend Engineer will evaluate RabbitMQ, SQS, and Redis Streams and present a recommendation by end of next week.
- Push notification certificate management process needs to be defined, particularly for APNs certificate rotation and FCM key management.
- The team needs to determine whether the WebSocket connection for in-app notifications should be shared with the existing task board WebSocket or maintained as a separate connection.
- Performance benchmarking: the team will run load tests against the proposed architecture to validate that the 5-second delivery latency target can be met under projected notification volumes.

## Context

This design session was triggered by the notification system overhaul intake (intake-webapp-notification-system) and directly informs the technical approach for all three Epics under the Notification System Overhaul Initiative. The decisions made here should be treated as the baseline technical direction unless subsequent technical reviews identify blocking concerns.
