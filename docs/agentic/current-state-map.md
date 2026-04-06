# Current State Map

This is the repo-grounded map of where agentic behavior lives today.

## Existing execution loop

- [public/script.js](/run/media/platinum/HDD/SillyBunny/public/script.js:4684)
  Calls `runPreGenerationAgents()` before chat-completions generation.
- [public/script.js](/run/media/platinum/HDD/SillyBunny/public/script.js)
  Calls `runPostGenerationAgents()` after generation.
- [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js:1047)
  Handles pre-generation retrieval injection.
- [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js:1062)
  Handles post-generation memory and lorebook runs.

## Current agent services

- [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js:619)
  `runRetrievalAgent()` searches lorebook entries, chat history, and saved memory, then injects a context block.
- [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js:745)
  `runMemoryAgent()` writes a compact summary, facts, and unresolved threads into chat metadata.
- [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js:807)
  `runLorebookAgent()` can search, create, and update lore entries in active world books.

## Current storage model

- [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js:95)
  Chat-scoped agent state currently stores:
  - enabled flags
  - service toggles
  - memory summary/facts/unresolved threads
  - last run status
- [public/scripts/world-info.js](/run/media/platinum/HDD/SillyBunny/public/scripts/world-info.js:4011)
  World info entries already support `agentBlacklisted`.

## Current strengths

- SillyBunny already has a live tool-using agent loop.
- It already separates retrieval, memory, and lore maintenance concerns.
- It already exposes agent state in the UI.
- It already has lore mutation primitives instead of prompt-only simulation.

## Current gaps versus Aventuras-style behavior

- No explicit "director" or planner that decides which services should run and why.
- No structured story-state model for characters, locations, inventory, quests, relationships, or time.
- Memory is durable but still lightweight; there is no chapter model or retrieval over chapter summaries.
- Lore autonomy exists, but it is not yet tied to a stronger world-state layer.
- No dedicated narrative action suggestion mode or adventure-mode turn structure.

## Best first extension points

- [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js)
  Add an orchestrator service or orchestration pass here first.
- [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js)
  Extend metadata shape here for structured story state.
- [public/scripts/sillybunny-tabs.js](/run/media/platinum/HDD/SillyBunny/public/scripts/sillybunny-tabs.js:2966)
  Expand the existing agent UI instead of creating a separate control surface too early.
- [public/scripts/world-info.js](/run/media/platinum/HDD/SillyBunny/public/scripts/world-info.js)
  Reuse world-info storage for lore, but keep story-state distinct from raw lore entries.
