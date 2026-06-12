# Skill Registry — pomodoro-timer

## Project Skills (user-level)

| Skill | Source | Triggers |
|-------|--------|----------|
| sdd-init | opencode/skills | Bootstrapping SDD in a project |
| sdd-propose | opencode/skills | Creating change proposals |
| sdd-spec | opencode/skills | Writing specifications with scenarios |
| sdd-design | opencode/skills | Technical design from proposals |
| sdd-tasks | opencode/skills | Breaking down changes into tasks |
| sdd-apply | opencode/skills | Implementing code from tasks |
| sdd-verify | opencode/skills | Validating implementation meets specs |
| sdd-archive | opencode/skills | Archiving completed changes |
| sdd-explore | opencode/skills | Exploring codebase and investigations |
| sdd-onboard | opencode/skills | Guided walkthrough of SDD workflow |
| skill-registry | opencode/skills | Managing skill registry |
| skill-creator | opencode/skills | Creating new AI skills |
| judgment-day | opencode/skills | Parallel adversarial review of code |
| branch-pr | opencode/skills | PR creation workflow |
| issue-creation | opencode/skills | GitHub issue creation workflow |

## Relevant Skills for This Project

- **sdd-{phase}** — All SDD phases are available for the full workflow
- **judgment-day** — Can be used for code review when needed

## Project Conventions

- **Language**: TypeScript 6
- **Framework**: React 19 with Vite 8
- **Testing**: Vitest 3 + @testing-library/react + jsdom
- **Linting**: ESLint with typescript-eslint
- **Type Checking**: tsc -b --noEmit

## Auto-Load Rules

When working on tests in this project, ensure vitest.config.ts is referenced for test commands.
