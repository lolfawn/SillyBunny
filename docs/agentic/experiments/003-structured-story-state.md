# 003: Structured Story State

## Title

First-pass structured story state in chat metadata and the Agent Mode panel.

## Goal

Track a compact world state separately from freeform lore so SillyBunny can update and surface current story facts even when no lorebook edit is needed.

## Inspiration

Aventuras-style agentic behavior feels more grounded when the system keeps an explicit snapshot of who matters, where the scene is, what items are relevant, and which threads are still active.

## Files touched

- [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js)
- [public/index.html](/run/media/platinum/HDD/SillyBunny/public/index.html)
- [public/css/sillybunny-tabs.css](/run/media/platinum/HDD/SillyBunny/public/css/sillybunny-tabs.css)

## Hypothesis

If the memory agent also maintains a small structured story-state object, retrieval can lean on cleaner current-state facts and users can inspect state changes without opening lorebooks or scanning old chat.

## User-visible change

- Agent Mode now shows structured story-state cards for location, time, characters, locations, inventory, and plot threads.
- Clearing agent memory also clears agent-generated story state.
- Retrieval can read structured state when gathering context for the next reply.

## Prompt / orchestration impact

- Expands the memory agent output schema with `story_state`.
- Expands retrieval with a `read_story_state` tool.
- Keeps the existing director layer and service order intact.

## Data impact

- Extends chat-scoped agent metadata with `story_state`.
- Existing chats should normalize safely on load.
- This is a first-pass schema, not the final state model.

## Validation

- Enable Agent Mode and run a few turns in one chat.
- Confirm the Story State cards populate after the memory agent runs.
- Confirm retrieval can still complete with the new `read_story_state` tool available.
- Clear agent memory and confirm story-state cards reset.

## Rollback plan

If the structured state becomes noisy or redundant, stop writing `story_state`, hide the Story State panel cards, and fall back to durable memory plus chapter summaries while keeping the schema easy to remove.
