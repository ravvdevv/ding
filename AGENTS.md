# AGENTS.md — ding
<!--
  AI OPERATING MANUAL — Read this before touching any file in the project.
  Updated: 2026-06-01
-->

## Project Overview
- **Name**: ding
- **Purpose**: Minimal CLI tool for Discord notifications and command wrapping.
- **Status**: stable
- **Last Updated**: 2026-06-01

## Tech Stack
| Layer      | Technology         | Notes / Constraints          |
|------------|--------------------|------------------------------|
| Runtime    | Bun / Node.js      | Node >= 18.0.0               |
| CLI        | bin/cli.js         | ES Modules                   |
| Packages   | axios, fs-extra, inquirer | Use bun for management    |

## Project Structure
```
ding/
├── bin/
│   └── cli.js       # Entry point, argument parsing, routing
├── lib/
│   ├── config.js    # Config management (global/local)
│   ├── notify.js    # Discord webhook integration
│   ├── onboarding.js # First-run interactive setup
│   └── runner.js    # Command execution and duration tracking
├── package.json     # Metadata and dependencies
├── README.md        # User documentation
├── LICENSE          # MIT License
├── llm.txt          # Machine-readable skill description
└── AGENTS.md        # AI operating manual (this file)
```

## Architecture Decisions
| Decision                  | Reason                              | Rejected Alternatives    |
|---------------------------|-------------------------------------|--------------------------|
| ES Modules                | Modern standard, native Bun/Node support | CommonJS                 |
| Local/Global Config       | Allow project-specific webhooks     | Global only              |
| Inherit Stdio             | Real-time feedback for wrapped commands | Piped/Buffered output    |

## Project-Specific Coding Rules
- No emoji in README or technical documentation.
- Maintain simple, professional wording.
- Config must prioritize local `.ding/config.json` over global.

## Agent Behavior Rules
- Read this file before reading any other file in this project.
- Before starting any task: state what you are about to do and why.
- After completing any task: state what changed and what to watch out for.
- Never introduce a new dependency without adding it to the Tech Stack table.
- Never change the folder structure without updating the tree above.
- Never add an environment variable without documenting it in the table below.
- Never assume a decision not listed in Architecture Decisions — ask first.

## Environment Variables
None required. Auth handled via `config.json` webhooks.

## Known Constraints & Gotchas
- Piped input (`echo "msg" | ding`) prevents interactive onboarding. Setup must be run in TTY first.
- `runCommand` uses `child_process.spawn` with `shell: true`.

## Definition of Done
A task or feature is complete when ALL of the following are true:
- [ ] Code is written and working as expected
- [ ] No TypeScript errors (if applicable)
- [ ] File size limit respected (≤300 lines)
- [ ] Commit message follows Conventional Commits standard
- [ ] AGENTS.md updated if anything structural changed
- [ ] No secrets or credentials committed to the repo
