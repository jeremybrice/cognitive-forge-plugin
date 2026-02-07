# Cognitive Forge Plugin

This plugin provides two commands for deep concept evaluation: `/debate` for multi-agent parallel analysis, and `/explore` for interactive guided exploration.

## Commands

### `/cognitive-forge:debate` — Multi-Agent Debate

Spawns specialized agents that simultaneously analyze a concept from different angles, then synthesizes their perspectives into refined understanding. The user observes the debate and receives a comprehensive synthesis.

**When to use**: When the user wants breadth — multiple independent perspectives evaluated in parallel, with cross-examination of disagreements and a unified synthesis.

**Persona**: Moderator (orchestrates agents, does not analyze directly)

### `/cognitive-forge:explore` — Interactive Exploration

Leads the user through structured concept exploration via iterative dialogue. The Guide applies cognitive techniques conversationally, pausing for user input at each step. Specialist agents are recruited only when complexity demands it.

**When to use**: When the user wants depth — iterative collaboration that follows the concept wherever the dialogue leads, with the user as active co-explorer.

**Persona**: Guide (conducts exploration directly, recruits agents selectively)

## Agent Roster

### Core Debate Agents (debate only)

These agents are spawned by the Moderator during `/debate` and run in parallel:

- **Challenger** (`forge-challenger`): Adversarial analysis — steel opposition, boundary mapping, pre-mortem, inversion
- **Explorer** (`forge-explorer`): Creative expansion — adjacent possibilities, constraint shaping, amplified vision, hybrid opportunities
- **Synthesizer** (`forge-synthesizer`): Integration — core thread identification, quality calibration, tension mapping, refinement

### Recruited Agents (available to both commands)

These agents are recruited conditionally based on concept complexity:

- **Decomposer** (`forge-decomposer`): Structural analysis for concepts with 4+ interacting components or nested dependencies
- **Evaluator** (`forge-evaluator`): Evidence grounding for concepts with checkable factual claims (has WebSearch/WebFetch access)

In `/debate`, the Moderator recruits them alongside core agents. In `/explore`, the Guide recruits them mid-dialogue when complexity warrants it.

## Concept Types

Both commands classify concepts into four types to guide technique selection:
- **Business**: Product ideas, strategies, market approaches
- **Philosophical**: Arguments, ethical stances, worldview claims
- **Framework**: Mental models, processes, methodologies
- **Creative**: Artistic choices, novel approaches, generative ideas

## Key Constraints

- Both commands are explicit invocation only — never auto-detect or auto-trigger
- Subagents cannot spawn other subagents
- The main Claude session acts as Moderator (debate) or Guide (explore), spawning agents via the `Task` tool
