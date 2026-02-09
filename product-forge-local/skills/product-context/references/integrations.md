# Integration Landscape — Format Guide

Your workspace integrations list lives in `memory/context/integrations.md`. Run `/productivity:setup-org` to configure.

This file documents the expected format for the integrations memory file. Actual integration data is read from `memory/context/integrations.md` at runtime.

## Expected Format

The `memory/context/integrations.md` file should use YAML frontmatter for the integrations list, with detailed descriptions in the markdown body:

```markdown
---
integrations:
  - SSO Provider
  - Payment Gateway
  - Email Service
  - Analytics Platform
  - Webhook System
---
# Integrations

## SSO Provider
Single Sign-On integration for enterprise authentication. Supports SAML 2.0 and OAuth 2.0 flows. Required for enterprise client onboarding.

## Payment Gateway
Payment processing integration for subscription billing and transaction management. Handles credit card processing, invoicing, and refunds.

## Email Service
Transactional and marketing email delivery. Manages templates, delivery tracking, and bounce handling.

## Analytics Platform
Third-party analytics integration for product usage tracking, funnel analysis, and user behavior insights.

## Webhook System
Event-driven integration system for real-time notifications to external services. Supports configurable endpoints and retry logic.
```

## Adding New Integrations

When adding a new integration:
1. Add the integration name to the `integrations` list in YAML frontmatter
2. Add a markdown section describing the integration purpose, protocols, and dependencies
3. Note any products or modules that depend on the integration
