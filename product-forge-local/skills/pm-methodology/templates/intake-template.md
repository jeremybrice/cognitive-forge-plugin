# Intake Card Template

Use this template when creating Intake cards from structured interview sessions.

## Structure

### Problem Statement

Write 2-3 sentences explaining the problem. Cover what is broken or missing, who is affected, and what the downstream impact is.

Example:
"The current notification management workflow requires operators to configure delivery rules individually per channel, leading to time-consuming setup and frequent errors when managing multi-channel campaigns. Product teams report that bulk operations are unavailable, forcing repetitive manual work across dozens of notification templates per campaign."

### Proposed Solution

Write 2-3 sentences describing what is being built and where it lives in the product.

Example:
"We propose building a campaign-level notification management interface within the WebApp that allows operators to configure, activate, and deactivate delivery rules at the campaign level rather than individual channel level. This will live in the existing Notification Management section of the WebApp and integrate with the API Gateway for delivery orchestration."

### In Scope

Bullet list of items explicitly included in this intake.

- Campaign-level notification management UI in WebApp
- Activate/deactivate controls per delivery channel
- Integration with API Gateway for delivery orchestration workflows
- Multi-campaign view with switching capability

### Out of Scope

Bullet list of items explicitly excluded, with brief context if needed.

- Automated channel assignment algorithms (future phase)
- Third-party delivery provider configuration updates
- End-user-facing notification preference changes

### Affected Systems

Bullet list using standard system names. Include both primary (where main work happens) and secondary (integrations and dependencies) systems.

- WebApp (primary: notification management UI)
- API Gateway (primary: delivery orchestration integration)
- Notification Service (secondary: channel dispatch registry)
- Database (secondary: engagement data processing)

### Defaults & Behaviors

Document key defaults and behavioral decisions. Use sub-bullets for multiple settings or fields.

- **Channel Status Toggle**: Default OFF (inactive). Only operators with Manager role or above can change. When toggled OFF, channel is hidden from campaign delivery plan but retains configuration.
- **Campaign View**: Default view shows all campaigns. Switching campaigns preserves unsaved changes with a confirmation prompt.

### Technical Considerations

Prose or bullets covering constraints, dependencies, backward compatibility, and data migration needs.

- Must maintain backward compatibility with existing channel-level management for single-channel campaigns
- API Gateway integration requires Notification Service API v2.1 or later
- Existing delivery rule data must be preserved during migration to campaign-level model
- Performance requirement: campaign view must load within 2 seconds for configurations with up to 50 channels

### Open Questions

Bullet list of engineering decisions and unknowns.

- Should channel deactivation cascade to scheduled notifications, or preserve them for reactivation?
- What is the maximum number of campaigns per account that the UI should support?
- How should the system handle API Gateway timeout scenarios during campaign configuration?

### Card Types Requested

The manifest of downstream cards to generate from this intake.

Example: "Initiative + Epic breakdown with Stories for Phase 1 features"

## Properties to Set

When creating an Intake card, populate these properties:

- **Project Name**: Format as `INTAKE-[Product]-[FeatureName]` in PascalCase (e.g., `INTAKE-WebApp-NotificationManagement`)
- **Product**: From taxonomy (e.g., WebApp, MobileApp, API Platform)
- **Module**: From taxonomy (e.g., Notifications, User Management, Billing)
- **Client**: From taxonomy (e.g., Acme Corp, Internal, Multi-Client)
- **Status**: Draft (until interview is confirmed and saved), then Complete, then Handed Off once downstream cards are generated
- **Created Date**: Auto-populated
- **Source Conversation**: Reference to the conversation or session

## Tone and Audience

Write Intake cards for product managers and engineering leads who will use them to scope downstream work. Language should be clear and comprehensive. The intake serves as the authoritative record of what was discussed and agreed upon during the interview.
