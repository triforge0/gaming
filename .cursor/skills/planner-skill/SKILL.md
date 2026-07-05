---
name: planner-skill
description: Use this skill when a feature or task is too large/complex for direct implementation. It converts specifications into ordered, vertical-slice task plans with clear dependencies, checkpoints, architecture decisions, and persistent planning documents. Triggers: large features, multi-file changes, system coordination, "break this down", "planning phase", "implementation plan", or when scope exceeds 1-2 files/subsystems.
---

# Planning and Task Breakdown

## Overview

This skill helps convert high-level specifications into **executable, ordered implementation plans**.

**Core Output**: A complete PLAN ONLY. Never implement code during planning.

---

## When to Use

**Use this skill when:**

- A feature spans multiple files or subsystems
- The task is too large for direct implementation
- You need to coordinate multiple components
- Vertical slicing or dependency management is required
- Parallel work is possible
- Before starting any significant new feature

**Do NOT use for:**

- Small single-function or single-file changes
- Trivial bug fixes
- Already well-scoped, tiny tasks

---

## Core Rules

> **Planning is mandatory** before any implementation when scope > 1 file or > 1 subsystem.

**Key Principles:**

- Always plan **bottom-up**
- Prefer **vertical slices** (end-to-end working functionality)
- Define **contracts first** for shared data/interfaces
- No L-sized tasks in final plan
- Insert checkpoints regularly

---

# Planning Files

Every implementation plan must also exist as a persistent planning document.

Repository structure:

```
planning/
    plan-{plan-id}-{plan-name}.md
    archive/
```

### Naming Convention

```
plan-{plan-id}-{plan-name}.md
```

Rules:

- `{plan-id}` is a zero-padded sequential number (`001`, `002`, `003`, ...)
- `{plan-name}` is lowercase kebab-case.
- Example:

```
planning/
    plan-001-infra-refactor.md
    plan-002-room-management.md
    plan-003-lan-discovery.md
```

### Lifecycle

When a new plan is created:

- Create the `planning/` directory if it does not exist.
- Create a new plan document.
- The plan document is the canonical source of truth.

When the implementation is completed:

- Move the plan into:

```
planning/archive/
```

Example:

```
planning/
    plan-004-matchmaking.md

    archive/
        plan-001-infra-refactor.md
        plan-002-room-management.md
        plan-003-lan-discovery.md
```

Rules:

- Never delete completed plans.
- Preserve filenames when archiving.
- Archived plans are immutable implementation history.
- If new work is required after completion, create a new plan instead of modifying an archived plan.
- The `archive/` directory is append-only.

---

## Planning Process

### Step 1: Read & Analyze Context

- Read full specification/user request
- Explore existing codebase (use tools to inspect files)
- Identify architectural constraints and patterns
- Note risks, unknowns, and dependencies
- **No code changes** at this stage

### Step 2: Identify System Boundaries

Break the system into major domains.

**Example (game server):**

- Core Models & Data Layer
- Game State Management
- Game Engine / Logic
- Physics & Collision
- Networking (WebSocket/UDP)
- State Replication / Sync
- Client-side Rendering & UI



**Rule:** Never implement UI before backend contracts.

### Step 4: Vertical Slicing

**Bad (Horizontal layers):**

- Build all APIs
- Build all database schemas
- Build all UI components

**Good (Vertical slices):**

- Player can join a room (backend + WebSocket + UI)
- Player can move character
- Player can shoot + collision detection (end-to-end)

### Step 5: Define Tasks

Each task follows this exact format:

```markdown
## Task X: Short Descriptive Title

### Description

What this task delivers (1–2 sentences).

### Acceptance Criteria

- [ ] Measurable condition 1
- [ ] Measurable condition 2

### Verification

- [ ] All tests pass
- [ ] Manual test steps defined
- [ ] System builds and runs without regression

### Dependencies

- Task Y (or None)

### Files

- `path/to/file1`
- `path/to/file2`

### Scope

- XS | S | M
```

---

## Task Sizing

| Size | Description |
|------|-------------|
| XS | Single function / small change |
| S | Small feature part |
| M | Full vertical slice |
| L | **Forbidden — must split** |

---

## Required Plan Structure

The implementation plan **and the generated planning document** must both follow this structure exactly:

```markdown
# Implementation Plan

## Overview

High-level summary of what we are building.

## Architecture Decisions

- Key design choices
- Protocols / contracts
- State ownership rules
- Important patterns

## Task List

(Ordered by execution)

## Checkpoints

(Every 2–3 tasks)

## Risks

- Technical risks
- Scaling concerns
- Unknowns

## Open Questions

(Items needing user input)
```

---

## Checkpoints

Insert after every 2–3 tasks:

```markdown
## Checkpoint

- [ ] Build succeeds
- [ ] Tests pass
- [ ] Feature works end-to-end
- [ ] No broken contracts
```

---

## Parallel Execution Rules

**Safe to parallelize:**

- Independent vertical slices
- Test writing
- UI work after contracts are locked

**Not safe:**

- Game engine + networking
- Shared state changes
- Backend + frontend before contract definition

---

## Contract-First Rule

When multiple components share data:

1. Define contract / DTO / protocol.
2. Lock the contract.
3. Implement backend.
4. Implement frontend.

**Never allow protocol divergence.**

---

## Definition of Done (per task)

A task is complete only when:

- All acceptance criteria are met.
- Build succeeds.
- No regressions.
- Verification steps completed.

A plan is complete only when:

- Every task is complete.
- The planning document has been moved to:

```
planning/archive/
```

---

## Red Flags (Reject or Split)

- Vague tasks ("implement feature")
- L-sized tasks
- Missing dependency order
- No checkpoints
- Mixing UI and backend without contracts
- Putting authoritative logic in frontend

---

## Output Format Reminder

Planning requests must produce:

1. The implementation plan.
2. A planning document located at:

```
planning/plan-{plan-id}-{plan-name}.md
```

When implementation is complete, move the document to:

```
planning/archive/
```

**Output = PLAN ONLY. Never implement code during planning.**

---

## See Also

- Project-specific architecture guidelines
- Global Definition of Done
- Existing code patterns (inspect before planning)