# Team Structure — Format Guide

Your workspace team and company information lives in `memory/context/company.md`. Run `/productivity:setup-org` to configure.

This file documents the expected format for the company memory file. Actual team data is read from `memory/context/company.md` at runtime.

## Expected Format

The `memory/context/company.md` file should describe leadership, team structure, and organizational notes:

```markdown
---
company: "Your Company Name"
---
# Team Structure

## Leadership

### Jane Smith
**Title:** CPO (Chief Product Officer)

**Role:** Reviews Initiatives. Final scope authority.

### John Doe
**Title:** CTO (Chief Technology Officer)

**Role:** Technical architecture decisions. Estimation validation.

## Product & Engineering

### Team Alpha
**Focus:** Core platform and API development.

### Team Beta
**Focus:** Mobile applications and field operations.

## Organizational Notes

- Teams are organized by product area
- Each team typically owns Epics under an Initiative
- Cross-team initiatives require coordination through leadership
```

## Adding Team Members or Structure

When updating team information:
1. Add new team members under the appropriate section
2. Include title and role description
3. Note any cross-team responsibilities or coordination patterns
