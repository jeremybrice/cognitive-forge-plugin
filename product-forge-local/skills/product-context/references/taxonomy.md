# Product Taxonomy — Format Guide

Your workspace taxonomy lives in `memory/context/products.md`. Run `/productivity:setup-org` to configure.

This file documents the expected format for the products memory file. Actual taxonomy values are read from `memory/context/products.md` at runtime.

## Expected Format

The `memory/context/products.md` file should use YAML frontmatter for enum lists, with detailed descriptions in the markdown body:

```markdown
---
products:
  - WebApp
  - MobileApp
  - API Platform
modules:
  - Authentication
  - Billing
  - Notifications
  - User Management
  - Reporting
systems:
  - WebApp
  - MobileApp
  - API Gateway
  - Notification Service
  - Database
---
# Products

## WebApp
The core web application. Browser-based management system for day-to-day operations including user management, reporting, configuration, and administration.

## MobileApp
Native mobile application for field operations and on-the-go access. Companion to the WebApp for mobile workflows.

## API Platform
Developer-facing API platform. Provides RESTful endpoints for third-party integrations, data exchange, and automation.

# Modules

## Authentication
User login, SSO, permissions, roles, and access control.

## Billing
Subscription management, invoicing, payment processing, and financial reporting.

## Notifications
Email, SMS, push notification delivery and template management.

## User Management
User accounts, profiles, team assignments, and organizational hierarchy.

## Reporting
Business intelligence, analytics dashboards, data exports, and scheduled reports.
```

## Adding New Products or Modules

When adding a new product or module:
1. Add the name to the appropriate YAML frontmatter list
2. Add a markdown section with a description in the body
3. Use consistent naming (PascalCase for products, PascalCase for modules)
