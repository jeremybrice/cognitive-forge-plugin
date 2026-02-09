---
name: add
description: Register a plugin in the Forge Shell sidebar
arguments:
  - name: plugin-name
    description: Name of the plugin to add (must exist in marketplace.json and have a dashboard.json file)
    required: true
---

# /shell:add <plugin-name>

Register a plugin dashboard in the Forge Shell.

## Steps

1. Read `../.claude-plugin/marketplace.json` and find the plugin entry matching `<plugin-name>`.
   - If not found, report an error listing available plugin names.

2. Read `../<plugin-name>/dashboard.json` and verify it contains `path`, `label`, and `icon` fields.
   - If `dashboard.json` doesn't exist or is missing required fields, report an error explaining the plugin has no dashboard configured.

3. Read `forge-shell/shell-registry.json`.
   - If the plugin is already registered (by name), report that it's already added and stop.

4. Append a new entry to `plugins` array:
   ```json
   {
     "name": "<plugin-name>",
     "label": "<from dashboard.label>",
     "icon": "<from dashboard.icon>",
     "dashboardUrl": "../<plugin-name>/<dashboard.path>"
   }
   ```

5. Write the updated `shell-registry.json`.

6. Confirm: "Added **<label>** (<icon>) to Forge Shell. Run `/shell:open` to view."
