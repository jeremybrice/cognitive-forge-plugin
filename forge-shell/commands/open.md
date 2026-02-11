---
name: open
description: Open the Forge Shell in a browser
---

# /shell:open

Open the Forge Shell in the default browser.

## Steps

1. Provide the user with a clickable link to the app:
   - "Open Forge Shell: [forge-shell/app/index.html](forge-shell/app/index.html)"

2. **Do NOT** attempt to open the file via bash commands (`open`, `xdg-open`, `start`, etc.) or any browser automation. These fail in many environments and cause unnecessary errors.

3. Follow up with: "When prompted, select your **project root** folder (the one containing `sessions/`, `cards/`, `TASKS.md`, `memory/`, etc.)."
