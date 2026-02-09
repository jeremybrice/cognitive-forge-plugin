---
description: Initialize the local cards directory structure for Product Forge Local.
---

# /init Command

## Overview

The `/init` command creates the local `cards/` directory structure at the project root. This is a prerequisite for all other Product Forge Local commands. The command is idempotent and safe to run multiple times.

## Behavior

### 1. Check for Existing Structure

Look for a `cards/` directory at the project root (the current working directory). Check which of the 7 required subdirectories exist.

### 2. Create Missing Directories

Create any missing subdirectories under `cards/`:

```
cards/
  initiatives/
  epics/
  stories/
  intakes/
  checkpoints/
  decisions/
  release-notes/
```

### 3. Report Results

**If directories were created:**
```
Initialized cards directory with [N] subdirectories:
  cards/initiatives/
  cards/epics/
  cards/stories/
  cards/intakes/
  cards/checkpoints/
  cards/decisions/
  cards/release-notes/

Ready for card creation. See sample-cards/ in the plugin directory for example data.

If you haven't configured your product taxonomy yet, run `/productivity:setup-org` to set up your products, clients, and teams.
```

**If all directories already exist:**
```
Cards directory already initialized. All 7 subdirectories present.
```

**If some directories already existed:**
```
Cards directory updated. Created [N] missing subdirectories:
  cards/[new-dir-1]/
  cards/[new-dir-2]/

[M] subdirectories already existed.
```

## Key Rules

- **Directories only:** Never create files. Only create the directory structure.
- **Idempotent:** Running `/init` multiple times has no side effects. It only creates directories that don't already exist.
- **No prompts:** This command does not require user confirmation. It runs immediately.
- **Reference data:** Point the user to `sample-cards/` in the plugin directory for working example cards they can reference or copy.

## Error Handling

- If the working directory is not writable, report the error and suggest checking permissions.
- If the working directory appears to be inside a plugin folder rather than a project root, warn the user and suggest running from the project root instead.
