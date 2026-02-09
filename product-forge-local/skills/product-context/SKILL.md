---
name: product-context
description: "Provides domain knowledge about the organization's product ecosystem, client relationships, integration landscape, and team structure. Reads taxonomy from memory/context/ files. Auto-invoked to resolve shorthand, enrich card generation, and provide organizational context."
---

# Product Context Skill

## Purpose

This skill enables Claude to understand and navigate the organization's product ecosystem without requiring explicit explanation during workflows.

**Key capabilities:**

- **Resolve shorthand references** -- When a user mentions a product or client informally, Claude resolves to the canonical name from the configured taxonomy without asking for clarification
- **Enrich card generation** -- When creating Initiatives, Stories, or Epics, Claude automatically tags products, modules, and clients based on conversation context
- **Provide organizational context** -- Claude understands team structure, stakeholder roles, and client relationships to surface relevant information
- **Maintain updatable knowledge** -- The `memory/context/` directory is the single source of truth for product domain knowledge and can be updated at runtime

## How to Use This Skill

On every invocation, Claude should:

1. **Check for domain knowledge** -- Before responding, read the `memory/context/` files if context involves products, modules, integrations, clients, or team coordination
2. **Resolve references** -- Use `memory/context/products.md` to map user shorthand to canonical product/module names
3. **Understand dependencies** -- Use `memory/context/integrations.md` to grasp how products depend on each other and external systems
4. **Identify stakeholders** -- Use `memory/context/clients.md` and `memory/context/company.md` to determine who cares about the work and who needs to be involved
5. **Tag appropriately** -- When generating cards, apply the correct product, module, and client tags from the taxonomy

## Config Resolution

### Primary Source: memory/context/

The `memory/context/` directory (managed by the Productivity plugin) is the single source of truth for taxonomy values:

| Need | Memory File | Frontmatter Key |
|------|-------------|-----------------|
| Products | memory/context/products.md | products |
| Modules | memory/context/products.md | modules |
| Systems | memory/context/products.md | systems |
| Clients | memory/context/clients.md | clients |
| Integrations | memory/context/integrations.md | integrations |
| Team/Company | memory/context/company.md | (structured content) |

### Graceful Degradation

If `memory/context/` files do not exist:
1. Accept freeform values (do not reject user input)
2. Inform user: "Run `/productivity:setup-org` to configure your organization's taxonomy"
3. After the workflow completes, offer to add used values to memory

### references/ Directory

The `references/` directory within this skill contains format documentation and placeholder examples showing the expected structure for each config file. It is not the source of truth for actual taxonomy values.

## Updating Domain Knowledge

Three scenarios trigger updates to the `memory/context/` files:

**1. Explicit user request**
"Add a new product to the taxonomy" or "Update the Acme Corp client profile"

**2. During card workflows**
When Claude encounters a product, module, or integration not in the memory files, flag it to the user and offer to add it in the next workflow step.

**3. Dedicated maintenance**
A user explicitly requests context updates via "/forge update-context" or similar trigger for periodic knowledge review.

**Updating process:**
- Edit the specific memory/context file directly (don't rewrite entire files)
- Update both the YAML frontmatter list and the markdown body
- Confirm the update to the user

## Memory Contribution (Optional)

When Product Forge discovers interaction-derived context during workflows, contribute to the shared Productivity memory system:

- **People insights** -> `memory/people/{name}.md`
  - Example: "Alex prefers architecture diagrams in technical stories"
- **Project context** -> `memory/projects/{name}.md`
  - Example: "Acme Corp rollout shifted from Q3 to Q4"
- **PM-specific terms** -> `memory/glossary.md`
  - Example: "ROM = Rough Order of Magnitude, SLA = Service Level Agreement"

**Note:** Only contribute if `memory/` directory exists (Productivity plugin is loaded). If not, degrade gracefully and inform the user to run `/productivity:setup-org`.

## Reference Files

The `references/` directory contains format documentation for each config file type:

- **`taxonomy.md`** -- Expected format for product lines, modules, and systems
- **`integrations.md`** -- Expected format for integration landscape and external systems
- **`clients.md`** -- Expected format for client relationships and profiles
- **`teams.md`** -- Expected format for team structure and organizational info
