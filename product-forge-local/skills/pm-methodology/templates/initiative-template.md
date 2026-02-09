# Initiative Card Template

Use this template when creating Initiative-level cards for ROM estimation and strategic scoping.

## Structure

### Background

Write 2–3 prose paragraphs describing the current state and the problem. Include market context, user pain points, or business drivers that make this Initiative relevant now. Answer: What problem are we solving? Why is this a priority?

Do not use bullets in this section. Prose allows for narrative flow that helps leadership understand strategic fit.

Example:
"The current notification delivery process relies on static templates and manual scheduling, leading to poor engagement rates and inconsistent user experience. Product teams report that they lack real-time visibility into delivery patterns, making it difficult to optimize send times and channel selection. This gap costs us an estimated $X in lost engagement annually and impacts customer retention scores, particularly among high-activity user segments."

### Proposed Solution

Write 2–3 prose paragraphs describing the high-level solution. What are we building? How does it solve the problem? Keep language business-focused and avoid deep technical details unless necessary for estimation.

This section should be understandable to non-technical stakeholders. Technical specifics belong in child Epics and Stories.

Example:
"We propose building a smart notification routing system that analyzes historical engagement patterns, user preferences, and activity signals to generate dynamic delivery recommendations at the user segment and channel level. Product teams will receive real-time analytics during campaign execution, enabling them to optimize delivery timing and reduce notification fatigue."

### Affected Systems

Provide a bullet list of systems impacted by this Initiative. Use standard system names. Include both primary systems (where the main work happens) and secondary systems (integrations or dependencies).

- WebApp (primary: notification management UI)
- API Gateway (primary: delivery routing logic)
- Notification Service (secondary: channel dispatch and delivery tracking)
- Database (secondary: engagement data and user preferences)

### Potential Requirements

List 4–6 high-level capabilities that need to be built. These are not implementation specs but enough detail for engineering to estimate effort. Each bullet should be substantive (1–2 sentences minimum) and describe a distinct capability.

- Dynamic delivery recommendations based on historical engagement patterns, user preferences, and activity signals
- Real-time analytics dashboard to monitor notification performance during campaign execution
- Integration with engagement history data to train and validate delivery optimization algorithms
- Dashboard for operations teams to monitor delivery accuracy and system health
- Ability to override or snooze recommendations with feedback recorded for model improvement

### Additional Considerations

Bullet list of cross-cutting concerns, migration needs, backward compatibility requirements, or client-specific constraints. Anything that affects estimation or feasibility.

- Backward compatibility: existing batch delivery functionality must continue to work if real-time routing is unavailable
- Multi-client constraints: optimization models must be trained per-client to avoid signal pollution
- Performance: delivery recommendations must generate within 2 seconds during campaign execution
- Mobile-first: notification preferences UI must work on older devices with spotty connectivity
- Data privacy: engagement data must be aggregated and anonymized for multi-client training

### Open Questions

List unknowns or decisions that haven't been made. Engineering will need answers to these for detailed estimation.

- What is the acceptable latency for delivery recommendations? Real-time or can we batch process?
- Do we train separate models per client or use a shared model with client-specific tuning?
- Should recommendations be mandatory or advisory? How do we handle override scenarios?
- What is the minimum historical data required (weeks, months) to start generating recommendations?
- Will this include integration with third-party delivery services or build internally?

### Out of Scope (Optional)

Bullet list of explicitly excluded items to prevent scope creep. Include this section if there are items that might reasonably be assumed as part of the Initiative but are intentionally excluded.

- Integration with external marketing automation platforms or campaign orchestration
- End-user-facing notification preference customization beyond basic settings
- Advanced machine learning or AI model customization beyond initial implementation
- Historical data cleanup or migration (use existing data as-is)

## Properties to Set

When creating an Initiative card in the product management system, populate these properties:

- **ROM Title**: Concise name for the Initiative (e.g., "Smart Notification Routing")
- **Summary**: Condensed version of Background + Proposed Solution (2–3 sentences max)
- **Product**: From taxonomy (e.g., WebApp, MobileApp, API Platform)
- **Module**: From taxonomy (e.g., Notifications, Authentication, Billing)
- **Client**: From taxonomy (e.g., Acme Corp, Multi-Client, Internal)
- **Status**: Draft (until approved)
- **Estimate Hours**: If available from engineering estimation session
- **Confidence**: If available (e.g., High, Medium, Low)
- **Created Date**: Auto-populated
- **Source Conversation**: Link to intake document or planning conversation
- **Source Intake**: Reference to intake form if from formal intake process

## Tone and Audience

Write Initiatives for leadership, product managers, and key stakeholders. Use clear, business-focused language. Avoid jargon unless the audience is technical. Focus on business value, strategic fit, market opportunity, and effort estimates.

An Initiative should be readable in 5 minutes. If it takes longer, it's too detailed; move specifics to child Epics.

## Example Initiative Card

**ROM Title**: Real-Time Notification Routing Engine

**Background**: Current notification delivery logic is static and does not adapt to user behavior or channel performance. Product teams report low engagement rates, particularly during peak usage hours and across multi-channel campaigns. This leads to notification fatigue, higher unsubscribe rates, and missed engagement windows. Customer feedback indicates that intelligent delivery timing is a competitive differentiator for enterprise clients.

**Proposed Solution**: Build a real-time notification routing engine that dynamically selects delivery channels and timing based on user activity patterns, engagement history, and channel availability. The system will consider user preferences, notification priority, and client-specific rules. Initially, this will power the WebApp's notification management feature for product teams, with future expansion to the MobileApp and enterprise client portals.

**Affected Systems**:
- WebApp (primary: notification management UI and campaign builder)
- API Gateway (primary: routing decision engine)
- Notification Service (secondary: multi-channel dispatch)
- Database (secondary: engagement analytics and user preference storage)

**Potential Requirements**:
- Real-time user activity signal integration to inform channel and timing selection
- Routing engine that balances delivery priority, user preferences, and channel capacity
- Operator notification system for delivery anomalies during active campaigns
- Admin interface for operations to manually adjust routing rules if needed
- Performance metrics dashboard for delivery optimization success rates

**Additional Considerations**:
- Must work with fallback defaults if real-time activity data is unavailable
- Backward compatible with existing batch notification delivery
- Performance critical: routing decisions must complete in under 500 milliseconds
- Multi-client: each client may have different routing priorities and channel preferences

**Open Questions**:
- Should enterprise clients have visibility into routing optimization decisions?
- What is the acceptable latency for routing changes? Can we batch optimize or must it be real-time?
- Do we build the routing engine or integrate with a third-party delivery optimization service?
- How do we handle user preference overrides?

**Out of Scope**:
- Integration with third-party marketing automation platforms
- End-user-facing notification customization beyond preference settings
- Channel-specific rendering customization or rich media support
- Predictive engagement scoring (separate initiative)

---

**Note**: This is a filled example. Your actual Initiatives will vary in detail and scope based on the specific domain and business context.
