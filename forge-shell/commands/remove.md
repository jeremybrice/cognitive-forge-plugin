---
name: remove
description: Remove a plugin from the Forge Shell sidebar
arguments:
  - name: plugin-name
    description: Name of the plugin to remove
    required: true
---

# /shell:remove <plugin-name>

Remove a plugin dashboard from the Forge Shell.

## Steps

1. Read `forge-shell/shell-registry.json`.

2. Find and remove the entry whose `name` matches `<plugin-name>`.
   - If not found, report an error listing currently registered plugins.

3. Write the updated `shell-registry.json`.

4. Confirm: "Removed **<plugin-name>** from Forge Shell. Run `/shell:open` to refresh."
