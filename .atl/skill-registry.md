# Skill Registry — pomodoro-timer

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | /Users/juanca/.config/opencode/skills/branch-pr/SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | /Users/juanca/.config/opencode/skills/judgment-day/SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | /Users/juanca/.config/opencode/skills/issue-creation/SKILL.md |
| When writing Go tests, using teatest, or adding test coverage | go-testing | /Users/juanca/.config/opencode/skills/go-testing/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI | skill-creator | /Users/juanca/.config/opencode/skills/skill-creator/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### branch-pr
- Every PR MUST link an approved issue (Closes/Fixes/Resolves #N) with `status:approved` label
- Branch naming: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
- Conventional commits required: `type(scope)!: description` with proper type-to-label mapping (`feat`→type:feature, `fix`→type:bug, `chore`→type:chore, etc.)
- PR body requires: linked issue, PR type (exactly one checkbox), summary, changes table, test plan, contributor checklist
- Add exactly one `type:*` label matching the PR type
- Run shellcheck on modified scripts before pushing
- Automated checks (issue reference, issue status, PR label, shellcheck) must pass before merge
- No `Co-Authored-By` trailers in commit messages

### judgment-day
- Orchestrator NEVER reviews code — only launches judges and synthesizes results
- Launch TWO judges via `delegate` (async, parallel) — NEVER sequential
- Both judges get IDENTICAL prompts with the same target; neither knows about the other (blind)
- Always wait for BOTH judges to complete before synthesizing verdict
- Classify warnings: real (normal user triggers it) vs theoretical (contrived/unrealistic scenario only)
- After Round 1: present verdict table to user, ASK before fixing. Fix only after user confirms.
- After fix: re-launch both judges in parallel for Round 2
- After 2 fix iterations, STOP and ASK user before continuing — never escalate automatically
- Sub-agents MUST report `**Skill Resolution**: {injected|fallback-registry|fallback-path|none}` at end
- Suspect findings (only one judge) are reported but NOT automatically fixed — triage to user

### issue-creation
- Use template (bug_report.yml or feature_request.yml) — blank issues disabled
- Every issue gets `status:needs-review` on creation automatically
- Search existing issues for duplicates before creating
- Bug report requires: pre-flight checks, description, steps to reproduce, expected/actual behavior, OS, Agent, Shell
- Feature request requires: pre-flight checks, problem description, proposed solution, affected area
- Maintainer MUST add `status:approved` before any PR can be opened
- Questions go to Discussions, not issues

### go-testing
- Prefer table-driven tests for pure function tests (`[]struct{name, input, expected, wantErr}` + `t.Run`)
- Test Model.Update() directly for Bubbletea TUI state transitions
- Use teatest.NewTestModel() for full TUI integration flows
- Use golden file tests for visual output comparison against `testdata/*.golden`
- Test both success and error cases for error-returning functions
- Use interface + mock to mock os/exec; use t.TempDir() for temp directories
- Organize test files alongside source: `model_test.go`, `update_test.go`, `view_test.go`
- Commands: `go test ./...`, `go test -v ./...`, `go test -run TestName`, `go test -cover ./...`

### skill-creator
- Use SKILL.md template with frontmatter: name, description (with "Trigger:"), license (Apache-2.0), metadata (author + version)
- Structure: `skills/{name}/SKILL.md` (required) + `assets/` (optional templates) + `references/` (optional local docs)
- Code templates/schemas → assets/; link to existing local docs → references/
- Start with Critical Patterns section (most important rules first), then Code Examples, then Commands
- Keep code examples minimal and focused — no lengthy explanations
- No Keywords section, no external web URLs in references (use local paths)
- Register new skill in AGENTS.md after creation

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| `.gitignore` | /Users/juanca/dev/ai-projects/pomodoro-timer/.gitignore | Standard Vite gitignore |
| `eslint.config.js` | /Users/juanca/dev/ai-projects/pomodoro-timer/eslint.config.js | ESLint with typescript-eslint + react-hooks + react-refresh |
| `tsconfig.app.json` | /Users/juanca/dev/ai-projects/pomodoro-timer/tsconfig.app.json | TypeScript strict mode, target ES2023, bundler resolution |
| `vitest.config.ts` | /Users/juanca/dev/ai-projects/pomodoro-timer/vitest.config.ts | Vitest config — separate from Vite config, jsdom env |

Read the convention files listed above for project-specific patterns and rules.
