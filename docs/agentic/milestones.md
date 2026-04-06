# Agentic Milestones

These are the recommended `staging` milestones for making SillyBunny more agentic in the direction of Aventuras.

## Milestone 1: Director Layer

Goal:
Turn the current fixed retrieval-before / memory-after / lore-after sequence into an explicit orchestration layer.

Deliverables:

- A per-turn orchestrator that records which services ran and why.
- A shared run context object for all services.
- Better status output in the agent panel.

Success check:

- You can inspect one turn and see the service order, reason, and outputs without reading raw console logs.

## Milestone 2: Stronger Durable Memory

Goal:
Move from a compact summary store toward richer long-horizon recall.

Deliverables:

- Chapter or segment summaries.
- Retrieval over summaries plus recent messages.
- Better distinction between durable facts, unresolved threads, and temporary context.

Success check:

- Long chats recover relevant prior events more reliably without over-injecting old context.

## Milestone 3: Structured Story State

Goal:
Track story state explicitly instead of burying everything inside freeform lore text.

Deliverables:

- Initial schema for:
  - characters
  - locations
  - inventory / items
  - plot threads / quests
  - time state
- Chat-scoped state storage and UI surfacing.

Success check:

- A turn can update state cards even when no lorebook edit is needed.

## Milestone 4: Safer Lore Autonomy

Goal:
Make lore updates more accurate and auditable.

Deliverables:

- Proposed-vs-applied lore updates in run history.
- Stronger rules for when to create versus update entries.
- Optional review mode before writes.

Success check:

- Lorebook mutations become easier to trust and easier to undo.

## Milestone 5: Agentic Turn UX

Goal:
Expose the agentic system as a user-facing experience, not just background plumbing.

Deliverables:

- Optional adventure-style turn helpers.
- Suggested next actions based on story state.
- Clear display of memory, world-state, and lore changes after a turn.

Success check:

- The app feels more like a guided story system and less like a plain chat with hidden helpers.
