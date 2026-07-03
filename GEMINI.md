# GEMINI.md — pointer to AGENTS.md

**This project's canonical context lives in [`AGENTS.md`](AGENTS.md).** Read it first; it is
the single source of truth for how this codebase works (architecture, modules, commands,
constraints). Do **not** put rules here — edit `AGENTS.md` so every AI tool shares identical
context. This file only exists so Gemini CLI loads that context.

The line below imports `AGENTS.md` into Gemini's context automatically:

@AGENTS.md
