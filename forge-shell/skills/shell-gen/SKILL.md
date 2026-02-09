---
name: shell-gen
description: Regenerate the Forge Shell HTML with current registry data
triggers:
  - invoked by /shell:open command
---

# Shell Generation Skill

## Purpose

Regenerates `forge-shell/shell.html` by reading the current `shell-registry.json` and embedding the plugin list as an inline JavaScript constant. This ensures the shell works as a standalone HTML file without runtime fetch dependencies.

## Behavior

When invoked:

1. Read `forge-shell/shell-registry.json` and parse the `plugins` array.

2. Read the existing `forge-shell/shell.html` file.

3. Find the line containing `const REGISTRY = ` and replace the entire constant declaration with the current registry data:
   ```js
   const REGISTRY = { "plugins": [ /* current data from shell-registry.json */ ] };
   ```

4. Write the updated `shell.html`.

## Important

- Do NOT modify any other part of shell.html — only the `REGISTRY` constant.
- The registry data must be valid JSON embedded in the JS constant.
- Preserve the rest of the HTML/CSS/JS structure exactly as-is.
