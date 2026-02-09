# Client Relationships — Format Guide

Your workspace client list lives in `memory/context/clients.md`. Run `/productivity:setup-org` to configure.

This file documents the expected format for the clients memory file. Actual client data is read from `memory/context/clients.md` at runtime.

## Expected Format

The `memory/context/clients.md` file should use YAML frontmatter for the client list, with detailed profiles in the markdown body:

```markdown
---
clients:
  - Acme Corp
  - Internal
  - Multi-Client
---
# Clients

## Acme Corp
**Relationship:** Enterprise customer. Key account with dedicated support.

**Key Initiatives:** Platform integration, custom reporting, feature parity across products.

**Requirements Pattern:** Enterprise-grade reliability expectations. Integration-driven timelines. Requires staging environment testing before production rollout.

**Taxonomy Tag:** Acme Corp

## Internal
**Taxonomy Tag:** Internal

Used for features driven by internal product strategy, technical debt reduction, platform improvements, or developer experience enhancements.

## Multi-Client
**Taxonomy Tag:** Multi-Client

Used when a feature serves multiple clients or the broader user base rather than a single client relationship.
```

## Adding New Clients

When adding a new client:
1. Add the client name to the `clients` list in YAML frontmatter
2. Add a markdown section with relationship details, key initiatives, requirements patterns, and taxonomy tag
3. Keep the "Internal" and "Multi-Client" entries as standard options
