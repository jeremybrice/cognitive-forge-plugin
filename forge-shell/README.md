# Forge Shell

Unified shell plugin that provides a navbar-driven index page for switching between plugin dashboards using iframes.

## Commands

- `/shell:add <plugin-name>` — Register a plugin in the shell sidebar. Reads marketplace.json and the plugin's dashboard manifest field.
- `/shell:remove <plugin-name>` — Remove a plugin from the shell sidebar.
- `/shell:open` — Regenerate shell.html with current registry data and open in browser.

## Key Files

- `shell.html` — The unified shell page with sidebar nav and iframe content area.
- `shell-registry.json` — JSON file tracking which plugins are registered in the shell.
- `skills/shell-gen/SKILL.md` — Skill for regenerating shell.html with current registry data.

## Architecture

- **iframes** for full isolation — existing plugin dashboards work unmodified inside the shell.
- **Shell owns the theme** and broadcasts to iframes via `postMessage({ type: 'forge-shell:theme', theme: 'dark' | 'light' })`.
- Participating plugins listen for the `forge-shell:theme` message and apply the theme via `data-theme` attribute.
- Hash routing (`shell.html#plugin-name`) preserves the active plugin across page reloads.

## Registry Format

```json
{
  "plugins": [
    {
      "name": "productivity",
      "label": "Productivity",
      "icon": "📋",
      "dashboardUrl": "../productivity/skills/dashboard.html"
    }
  ]
}
```

## Theme Protocol

The shell broadcasts theme changes to all iframes:
```js
postMessage({ type: 'forge-shell:theme', theme: 'dark' | 'light' })
```
Each participating dashboard listens for this message and applies the theme using the `data-theme` attribute on `document.documentElement`, which matches their existing CSS variable system.
