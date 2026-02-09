---
name: open
description: Regenerate and open the Forge Shell in a browser
---

# /shell:open

Regenerate `shell.html` with the current registry and open it in the browser.

## Steps

1. Read `forge-shell/shell-registry.json` to get the current list of registered plugins.

2. Invoke the `shell-gen` skill to regenerate `forge-shell/shell.html` with the current registry data embedded inline in the HTML as a JavaScript constant.

3. Open the file in the default browser:
   ```bash
   open forge-shell/shell.html
   ```

4. Confirm: "Forge Shell opened with <N> plugin(s) registered."
