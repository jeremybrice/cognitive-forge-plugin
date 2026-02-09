# Knowledge Checkpoint Template

Use this template when capturing knowledge checkpoints from conversations.

## Structure

### Summary

Write a concise overview of what this checkpoint captures. 1-2 sentences that give a reader the key takeaway without reading further.

Example:
"Captured the architectural decisions made during the notification system architecture session, including the decision to use event-driven notification routing instead of polling-based delivery and the integration approach with the API Gateway."

### Key Points

Bullet list of important items discussed or discovered.

- Notification routing will use a tab-based UI within the existing Notification Management section
- Channel activation/deactivation must be bidirectional with the API Gateway
- Performance target: 2-second response time for routing configurations with up to 50 channels
- API Gateway v2.1 is required for multi-channel delivery capabilities

### Decisions & Conclusions

Prose or bullets describing decisions that were reached during the conversation.

- Decided to implement event-driven notification routing rather than extending the existing polling-based delivery interface. This provides cleaner separation of concerns and avoids retrofitting the batch delivery system.
- Agreed that Phase 1 will cover WebApp and API Gateway only. MobileApp integration is deferred to Phase 2.

### Open Items

Bullet list of unresolved items or next steps.

- Need to confirm API Gateway v2.1 availability timeline with the backend team
- CTO to review the proposed notification data model before Story creation begins
- Open question: maximum channels per campaign for UI performance testing

### Context

Additional context that would help someone picking this up later understand the full picture. 1-2 paragraphs.

"This checkpoint was captured during the initial design session for the Notification System Architecture Rework. The discussion focused on the notification routing epic and its integration points with the API Gateway. Key stakeholders present were the Product Manager, CTO, and Engineering Lead. The decisions here inform the Epic and Story breakdown that will follow."

## Properties to Set

When creating a Knowledge Checkpoint, populate these properties:

- **Checkpoint Title**: Descriptive title of what was captured (e.g., "Notification Architecture Decisions")
- **Domain**: Select one: Integration, Operations, Configuration, Reporting, Mobile, Feature Scope, Architecture, Requirements, Technical Spec, Stakeholder Context
- **Product**: From taxonomy (e.g., WebApp, MobileApp, API Platform)
- **Module**: From taxonomy (e.g., Notifications, User Management, Billing)
- **Client**: From taxonomy (e.g., Acme Corp, Internal, Multi-Client)
- **Status**: Current (active checkpoint), Superseded (replaced by newer checkpoint), or Archived (historical reference)
- **Checkpoint Date**: The date the checkpoint was captured (YYYY-MM-DD)
- **Created Date**: Auto-populated
- **Source Conversation**: Reference to the conversation

## Tone and Audience

Write checkpoints as concise knowledge records. The audience is future-you or a teammate who needs to understand what was discussed without replaying the entire conversation. Focus on decisions, conclusions, and open items rather than blow-by-blow conversation details.
