# Product Forge Local

Product management plugin for structured card generation. All outputs follow the Jira hierarchy: Initiative → Epic → Story. This plugin uses local markdown files with YAML frontmatter instead of Notion for persistence.

## Commands

- `/init` — Initialize the local cards directory structure. Creates 7 subdirectories under `cards/` if they don't exist. Safe to run multiple times.
- `/intake` — Structured interview for gathering product requirements. Produces an intake summary with a manifest of card types to generate. On approval, spawns sub-agents to create downstream cards automatically.
- `/initiative` — Generate, update, or review Initiative cards (top-level scope definition and estimation). Modes: create, update, review.
- `/epic` — Generate, update, or review Epic cards (team-level feature container under an Initiative). Modes: create, update, review.
- `/story` — Generate, update, or review Story cards (engineer-level work items under an Epic). Modes: create, update, review.
- `/release-notes` — Generate product release notes from feature descriptions or Jira stories. Produces .docx files and writes a tracking entry to local cards.
- `/checkpoint` — Capture a knowledge checkpoint from the current conversation to a local markdown file.
- `/decision` — Log a decision to the local Decision Log.

## Foundation Skills (auto-invoked)

- **local-routing** — Folder structure, filename conventions, YAML frontmatter schemas, relationship logic, read/write patterns for all local card types.
- **pm-methodology** — Jira hierarchy rules, formatting directives, card templates, organizational standards.
- **product-context** — Product taxonomy, integration landscape, client relationships, team structure. Reads from productivity memory system (`memory/context/`) with local references/ as format documentation.

## Formatting Rules (always enforced)

- Never use dashes to separate thoughts in text outputs; dashes acceptable in compound words only.
- Never use table format in cards for Jira; use prose or bullet points.
- When given a prompt, generate understanding and discuss before executing. Exceptions: follow-on prompts or user answers to Claude's questions.

## Jira Hierarchy

- **Initiative** — Large/multi-team projects. Top-level scope definition and estimation.
- **Epic** — Each team gets an Epic under the Initiative. Team-level feature container.
- **Story** — Cards under Epics are what engineers work from directly. Atomic work items.

## Memory Model

Product Forge Local uses a three-tier knowledge architecture:
1. **SKILL.md files** — Skill behavior definitions (when to trigger, how to act)
2. **Productivity memory system** — Organizational taxonomy (products, modules, clients, integrations, teams) stored in `memory/context/` with YAML frontmatter. Configured via `/productivity:setup-org`.
3. **Shared Productivity memory** — Interaction-derived context (people preferences, project context) written to the shared memory/ directory using Productivity plugin conventions

If taxonomy is not configured, Product Forge Local accepts freeform values and suggests running `/productivity:setup-org` to set up validated taxonomy lists.

## Local File Persistence

All card types and knowledge entries write to the local `cards/` directory at the project root. The local-routing skill contains all folder paths, filename conventions, and YAML frontmatter schemas. Local markdown files are the source of truth; Jira syncs downstream when available.

### Cards Directory Structure

```
cards/
  initiatives/       ← Initiative cards (top-level parent)
  epics/             ← Epic cards (children of Initiatives)
  stories/           ← Story cards (children of Epics)
  intakes/           ← Intake interview outputs
  checkpoints/       ← Knowledge checkpoint snapshots
  decisions/         ← Decision log entries
  release-notes/     ← Release note documents
```

## Bidirectional Relationship Maintenance

When creating any card that has a parent, always:
1. Set the `parent` field in the new card's frontmatter to the parent card's filename (without `.md`)
2. Add the new card's filename to the parent card's `children` array
3. Update the parent card's `updated` date to today

When creating cards from an intake, update the intake card's `generated_initiatives` and `generated_epics` arrays.

## Update Protocol

When updating an existing card:
1. Read the existing file and parse frontmatter and body
2. Apply only the sections that changed
3. Present a diff to the user for approval (mandatory; never silently overwrite)
4. On approval, write the updated file with the new `updated` date

## Sub-Agent Orchestration

Multi-step workflows use the Task tool to spawn focused agents. The /intake command's orchestration pipeline reads the approved manifest and spawns card-generation agents (Initiative, Epic, Story, Checkpoint) with scoped context. Independent agents run in parallel. Dependent agents wait for upstream results. Each agent receives a target folder path and frontmatter schema, and returns the filename of the created card.
