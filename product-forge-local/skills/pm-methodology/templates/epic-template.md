# Epic Card Template

Use this template when creating Epic-level cards for team-level scope definition and story breakdown.

## Structure

### Background/Context

Write 1–2 prose paragraphs explaining why this Epic exists. Link it to the parent Initiative. Describe the business value and how it fits into the larger product roadmap. An engineer reading this should understand the "why" without needing to reference the Initiative.

Example:
"This Epic breaks down the Smart Notification Routing Initiative into the core delivery optimization engine. The optimization engine is the foundation that enables all downstream features like real-time channel selection and engagement analytics. It will be owned by the Platform team and shared across all user-facing products."

### Epic Scope

Write 1–2 prose paragraphs defining the exact capability being delivered. Be precise about boundaries. What's included? What's deferred? This section answers: "What will the system be able to do when this Epic is complete?"

Do not use bullets. Prose supports clear boundary definition.

Example:
"This Epic delivers a notification processing pipeline that analyzes historical engagement data to generate delivery optimization recommendations at the user segment and channel level. The system will ingest daily engagement events, clean and aggregate them by user segment and channel, and train optimization models to predict optimal delivery windows 7 days ahead. The output is a set of routing rules pushed to the API Gateway that downstream systems can consume. Excluded from this Epic: real-time adaptive routing, model retraining automation, and client-facing optimization visualization."

### Affected Systems

Bullet list of systems touched by this Epic. Use standard system names. Include both primary and secondary systems.

- WebApp (primary: notification management and configuration)
- Database (primary: engagement data pipeline and storage)
- API Gateway (secondary: routing rule consumption)
- Notification Service (secondary: delivery execution and feedback loop)

### Functional Capabilities

Bullet list of discrete capabilities the system will have upon completion. Each capability should be observable and testable. 1–2 sentences per bullet.

- Generate delivery optimization recommendations for each user segment at the channel level with 7-day lookahead
- Ingest daily engagement event batches and automatically clean and aggregate data
- Retrain models weekly with rolling window of historical data (minimum 6 months)
- Export routing rules to the API Gateway for consumption by downstream systems
- Monitor model performance metrics and alert if optimization accuracy degrades below threshold
- Support multi-client model training with data isolation

### Suggested Story Breakdown

Bullet list of candidate Stories that will decompose this Epic. Each bullet is a potential Story card with a brief description. Use this to communicate the breakdown and identify dependencies or sequencing needs.

- Data pipeline infrastructure: Build ETL pipeline to ingest engagement events, clean, aggregate by user segment and channel, and store in data warehouse
- Baseline optimization models: Implement time-series models for channel-level delivery prediction
- Model training automation: Build weekly training job that ingests recent data, retrains models, and validates performance
- Routing rule export and serving: Implement batch export of routing rules to API Gateway with format and delivery guarantees
- Monitoring and alerting: Build dashboards to track model performance and alert on accuracy degradation
- Multi-client data isolation: Implement data partitioning and isolation to train separate models per client
- Integration with downstream systems: Coordinate with WebApp and Notification Service teams on routing rule consumption format and delivery mechanism

### Success Criteria

Bullet list of observable outcomes that indicate the Epic is complete and working. These are not detailed acceptance tests but high-level success measures.

- Routing rules are generated weekly and exported to the API Gateway with 99.5% uptime
- Model accuracy (engagement rate lift or similar) meets defined threshold for production use
- Routing rules are available for all user segments and channels in the system
- Downstream systems (WebApp, Notification Service) successfully consume and use routing rules
- System handles multi-client data correctly with no cross-client data leakage
- Monitoring dashboards show key metrics and alert on degradation

### Related Epics/Dependencies

Bullet list of other Epics this depends on or relates to. Include sequencing constraints.

- Depends on: Data Infrastructure Epic (data warehouse and ETL foundation must exist)
- Blocks: Real-Time Adaptive Routing Epic (needs optimization output from this Epic)
- Related: Engagement Analytics Epic (will consume optimization data for reporting)

### Technical Constraints

Bullet list of known technical limitations or requirements that affect design. Write these as constraints, not solutions.

- Must work with data available in current data warehouse (no new data sources)
- Model training must complete within 24-hour window
- Routing rule export must support JSON format for API Gateway compatibility
- Multi-tenancy: models must be completely isolated by client
- Historical data available is limited to 18 months (use rolling window)

### Open Questions

Bullet list of decisions not yet made that will affect Story creation. Engineering and product should resolve these before Stories are written.

- Which optimization algorithms should we use? (time-series, collaborative filtering, or hybrid?)
- What is the acceptable accuracy threshold for production deployment?
- Should routing rules update daily or weekly?
- How far ahead should we optimize? (7 days, 14 days, or variable?)
- Will we use cloud ML services or open source libraries?
- What is the budget and latency tolerance for model training?

### Out of Scope (Optional)

Bullet list of items explicitly excluded from this Epic. Use this to prevent scope creep and clarify what belongs in future Epics.

- Real-time adaptive routing via API (deferred to future Epic)
- Automated model retraining (manual trigger initially)
- Client-facing optimization visualization or explanations
- Integration with external data sources (third-party analytics, market signals)
- Advanced techniques like deep learning or ensemble methods

## Properties to Set

When creating an Epic card, populate these properties:

- **Epic Title**: Clear name reflecting the deliverable (e.g., "Notification Delivery Optimization Engine")
- **Description**: Epic Scope condensed to 2–3 sentences
- **Initiative**: Link to parent Initiative
- **Product**: From taxonomy (e.g., WebApp, MobileApp, API Platform)
- **Module**: From taxonomy (e.g., Notifications, Authentication, Billing)
- **Client**: From taxonomy (e.g., Acme Corp, Multi-Client, Internal)
- **Status**: Planning (until fully broken down into Stories)
- **Created Date**: Auto-populated
- **Source Conversation**: Link to planning doc or discussion
- **Source Intake**: Reference if from formal intake
- **Related ROMs**: Link to parent Initiative if not already linked

## Tone and Audience

Write Epics for product managers, team leads, and senior engineers. Use clear, specific language about scope and deliverables. Avoid vague language like "improve" or "enhance." Be concrete about boundaries and dependencies.

An Epic should take 10 minutes to read and understand fully. It should answer all questions needed to break it into Stories.

## Example Epic Card

**Epic Title**: Notification Delivery Optimization Engine

**Background/Context**: The Smart Notification Routing Initiative requires a robust optimization engine to generate delivery recommendations that product teams and operations can act on. This Epic delivers the core processing pipeline that powers all downstream routing and analytics features. It is owned by the Platform team and will be consumed by the WebApp, Notification Service, and future Analytics dashboards.

**Epic Scope**: This Epic builds a data processing pipeline that ingests daily engagement events, trains optimization models at the user segment and channel level, and exports routing rules to the API Gateway. The system will generate 7-day ahead delivery optimization recommendations for all user segments and channels, retraining models weekly with historical data. The output format will be JSON documents pushed to the API Gateway for downstream system consumption. Excluded: real-time adaptive routing, client-facing dashboards, integration with external analytics sources.

**Affected Systems**:
- Database (primary: data pipeline and model training)
- WebApp (primary: engagement data source and configuration)
- API Gateway (secondary: routing rule consumption)
- Notification Service (secondary: delivery execution and feedback)

**Functional Capabilities**:
- Ingest daily engagement event batches and validate data quality
- Train optimization models at user segment and channel granularity
- Generate 7-day delivery optimization recommendations with confidence intervals
- Export routing rules to API Gateway in standardized format
- Monitor model accuracy and alert on degradation
- Support multi-client training with complete data isolation

**Suggested Story Breakdown**:
- Data pipeline infrastructure: ETL to ingest, clean, and aggregate engagement event data
- Optimization models: Implement time-series models for baseline delivery predictions
- Weekly training automation: Build scheduled job for model retraining and validation
- Routing rule export: Batch export to API Gateway with format and delivery guarantees
- Performance monitoring: Dashboards and alerts for model accuracy tracking
- Multi-client support: Data partitioning and isolation logic
- Downstream system integration: Coordinate consumption format with WebApp and Notification Service

**Success Criteria**:
- Routing rules generated and exported weekly with 99.5% uptime
- Model accuracy stays above defined threshold across all user segments and channels
- All user segments and channels have active routing rules
- Zero cross-client data leakage in production
- WebApp and Notification Service successfully consume routing rules in pilot

**Related Epics/Dependencies**:
- Depends on: Data Infrastructure Epic (warehouse and ETL must exist first)
- Blocks: Real-Time Adaptive Routing Epic (depends on optimization output availability)
- Related: Engagement Analytics Epic (will consume optimization data)

**Technical Constraints**:
- Must use only data available in current data warehouse
- Model training window must be under 24 hours
- Support JSON export format for API Gateway compatibility
- Historical data limited to 18 months
- Must support multi-tenancy with isolated models per client

**Open Questions**:
- Optimization algorithm choice: time-series vs. collaborative filtering vs. hybrid approach?
- Accuracy threshold for production: acceptable engagement rate lift?
- Routing rule frequency: daily or weekly?
- Optimization horizon: 7 days, 14 days, or configurable?
- Use managed ML services or open source libraries?

**Out of Scope**:
- Real-time adaptive routing
- Automated retraining (manual trigger only)
- Client-facing visualizations
- External analytics integration
- Advanced techniques like deep learning

---

**Note**: This is a filled example. Your Epics will vary based on context. Ensure Story Breakdown is detailed enough for team planning.
