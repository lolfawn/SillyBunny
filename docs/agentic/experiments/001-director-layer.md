# 001: Director Layer

## Title

Director layer over retrieval, memory, and lorebook services.

## Goal

Replace the implicit fixed order of agent calls with an explicit orchestrator that owns turn context, service decisions, and run history.

## Inspiration

Aventuras-style agentic behavior feels more intentional because the system behaves like it understands the turn as a whole, not just as isolated helper calls.

## Files touched

- [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js)
- [public/scripts/sillybunny-tabs.js](/run/media/platinum/HDD/SillyBunny/public/scripts/sillybunny-tabs.js)
- [public/script.js](/run/media/platinum/HDD/SillyBunny/public/script.js)

## Hypothesis

If SillyBunny records a shared turn context and makes service execution explicit, later work on memory, story state, and action suggestions will become easier and less brittle.

## User-visible change

The agent panel should show a clearer per-turn record:

- what services ran
- what each one produced
- whether something was skipped intentionally

## Prompt / orchestration impact

- Changes pre-generation behavior by routing retrieval through a turn orchestrator.
- Changes post-generation behavior by routing memory and lorebook through the same orchestrator.
- Does not need to add a brand-new LLM-facing service yet.

## Data impact

- May extend chat metadata with a `last_turn` or `last_orchestration` record.
- Should not require lorebook format changes.
- Should avoid destructive migration in the first pass.

## Validation

- Start a chat with Agent Mode enabled.
- Send one normal turn and confirm retrieval runs before generation.
- Confirm memory and lorebook runs are recorded after generation.
- Confirm skipped services show up as skipped rather than silently disappearing.

## Rollback plan

Keep the existing direct service calls easy to restore. If the orchestrator becomes noisy or brittle, fall back to the current fixed execution flow while keeping the UI improvements.
