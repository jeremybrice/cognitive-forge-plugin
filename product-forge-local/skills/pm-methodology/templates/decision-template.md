# Decision Log Entry Template

Use this template when logging decisions to the Decision Log.

## Structure

### Decision

Write the full decision statement in prose. Be specific about what was decided.

Example:
"We will implement an event-driven notification pipeline in the WebApp rather than extending the existing polling-based delivery system. Event-driven routing will be a new module within the Notification Management section, with its own data model and API endpoints."

### Rationale

Explain why this decision was made. Include trade-offs considered, alternatives evaluated, and the reasoning that led to this choice.

Example:
"The existing polling-based delivery system was not designed for real-time multi-channel routing and would require significant refactoring to support event-driven operations. A new event-driven approach provides cleaner separation of concerns, allows parallel development without disrupting existing batch delivery, and aligns with the long-term vision of unified notification management. The trade-off is additional development time upfront (estimated 2 weeks more than retrofitting), but this is offset by reduced maintenance burden and better extensibility."

### Impact

Describe what changes as a result of this decision. Include affected systems, teams, and timelines.

Example:
"This decision affects the WebApp Notification module and the API Gateway integration layer. The WebApp team will own the new event-driven routing UI, while the API Gateway team will need to update their delivery workflow to support event-driven operations. Timeline impact: adds approximately 2 weeks to the notification routing epic but simplifies the story breakdown and reduces risk of regression in existing batch delivery features."

### Stakeholders

List who was involved in making this decision and who needs to be informed.

Example:
"Decision makers: Product Manager, CTO. Informed: Engineering Lead (WebApp), Engineering Lead (API), VP of Product (for awareness)."

## Properties to Set

When creating a Decision Log entry, populate these properties:

- **Decision Title**: Concise, action-oriented title (e.g., "Use event-driven notification pipeline instead of polling-based delivery")
- **Type**: Select one: Architecture, Scope, Priority, Technical, Stakeholder Commitment
  - **Architecture**: Technical design decisions, system structure, integration patterns
  - **Scope**: What is in or out, feature boundaries, MVP definitions
  - **Priority**: Sequencing decisions, what to build first, trade-offs
  - **Technical**: Implementation approach, technology choices, performance targets
  - **Stakeholder Commitment**: Agreements with clients, leadership sign-offs, timeline commitments
- **Status**: Active (current decision), Revised (updated by a newer decision), or Reversed (decision was overturned)
- **Stakeholders**: Roles of people involved or affected
- **Product**: From taxonomy
- **Module**: From taxonomy
- **Client**: From taxonomy
- **Decision Date**: The date the decision was made (YYYY-MM-DD)
- **Created Date**: Auto-populated
- **Source Conversation**: Reference to the conversation

## Tone and Audience

Write decisions as authoritative records. The audience is anyone who needs to understand why something was decided, including future team members, stakeholders reviewing past decisions, and engineers who need to understand constraints. Use clear, professional language. Avoid hedging; a decision should read as definitive.
