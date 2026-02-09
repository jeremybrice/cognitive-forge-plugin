---
title: "Use Event-Driven Architecture for Notification Pipeline"
type: decision
status: Approved
product: WebApp
module: Notifications
client: Acme Corp
team: Platform
decision_date: 2026-02-08
created: 2026-02-08
updated: 2026-02-08
---

## Decision

The notification system overhaul will use an event-driven architecture with a central message bus rather than the current synchronous inline sending model or an asynchronous queue-based worker model. Application services will publish notification events to the message bus, and channel-specific consumer services (email, push, in-app) will independently subscribe to and process events from the bus.

## Rationale

The team evaluated three architecture options during the notification architecture design session:

Option 1 (synchronous with retry) would add retry and failover logic to the existing inline email sender. This was rejected because it does not address the fundamental coupling between application logic and notification delivery, would degrade application response times as retry logic adds latency to the request path, and provides no path to multi-channel support without significant refactoring.

Option 2 (asynchronous queue with worker) would move notification sending to a background worker consuming from a single queue. This is a significant improvement over the current model and would address reliability concerns, but it centralizes all delivery logic in a single worker service. Adding new channels requires modifying the worker, and scaling different channels independently is not possible because they share the same processing pipeline.

Option 3 (event-driven with message bus) decouples event production from consumption entirely. Each channel operates as an independent consumer service that subscribes to the event types it cares about and handles delivery through its own pipeline. This enables independent scaling (email delivery can scale separately from push delivery), independent deployment (shipping a push notification fix does not risk affecting email delivery), and straightforward channel addition (a new channel is a new consumer service with no changes to existing services or the event bus).

The event-driven model was selected because it best supports the initiative's goals of multi-channel delivery, delivery reliability, and long-term extensibility. The additional operational complexity of managing a message bus and multiple consumer services is justified by the flexibility and resilience benefits.

## Impact

- All notification delivery will be asynchronous. Application services will publish events and return immediately, with no blocking on delivery.
- A message bus infrastructure component must be provisioned and operated by the Platform team. This adds an operational dependency but centralizes notification routing in a well-understood messaging pattern.
- Each delivery channel (email, push, in-app) will be an independent service with its own deployment, scaling, and monitoring. This increases the number of services the team manages from 1 to 4 (bus + 3 channels) but isolates failures to individual channels.
- Existing notification triggers in the application codebase must be refactored from direct email API calls to event publication calls. This is a one-time migration cost estimated at 2 to 3 days of engineering effort.
- Delivery latency for real-time channels will include the overhead of event bus processing (estimated 100 to 500ms), which must be factored into the 5-second delivery SLA.

## Stakeholders

- Platform Tech Lead: approved as the technical direction for the notification overhaul
- Senior Backend Engineer: will lead implementation of the event bus and consumer services
- Frontend Lead: acknowledges that real-time in-app delivery will use WebSocket integration with the event bus
- Product Lead: accepts the tradeoff of additional operational complexity for long-term flexibility and multi-channel support
- Engineering Director: approved the infrastructure investment required for message bus provisioning
