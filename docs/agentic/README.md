# Agentic Staging Workflow

This folder is the working area for making `staging` the branch where SillyBunny experiments with more story-aware prompt behavior during RP generation.

The approach is closer to [OpenClaw](https://rentry.org/OpenClaw) than to autonomous agent frameworks: the agents are custom prompts and service hooks that run around the RP generation loop to augment story flow. They are not multi-step orchestration bots.

SillyBunny already has a useful baseline in [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js): retrieval, memory, and lorebook services tied into the generation loop. The goal here is to evolve that foundation instead of replacing it blindly.

## What "agents" means in SillyBunny

SillyBunny currently has two agent layers:

- **Agent Mode** is the built-in, chat-scoped service system for retrieval, memory, and lorebook maintenance.
- **In-Chat Agents** are user-managed prompt modules on the Agents page. They are modular RP helpers for trackers, formatters, cleanup passes, directives, and randomisers.

That distinction matters:

- Agent Mode is about durable chat support.
- In-Chat Agents are about configurable prompt behavior around a single turn.

## How the pipeline works

At a high level:

1. **Pre-generation** hooks can inject prompt material before the main model call.
2. **Main generation** produces the assistant response.
3. **Post-generation prompt transforms** can rewrite the response or append extra content, optionally on a separate connection profile.
4. **Post-processing** can extract structured data, run regex cleanup/formatting, and preserve machine-readable blocks while showing friendlier UI.
5. **Saved metadata** stores the result of trackers, extracted variables, and group/template selections for later turns.

Common examples:

- Retrieval adds context before the next reply.
- A tracker agent appends structured scene or relationship state after the reply.
- Regex scripts reformat tags like `[SCENE]` or `[DIRECTIONS]` into cleaner visible cards.
- Cleanup agents remove or normalize unwanted writing patterns after generation.

## Recent changes

### v1.3.1 (2026-04-12)

- Fixed broken In-Chat Agent card interactions and restored reliable backend-backed Agent Group behavior
- Added ST-style regex script support for bundled and custom agents
- Added prompt-transform passes with `rewrite` and `append` modes, plus alternate connection-profile support
- Bundled trackers now default to post-generation prompt append
- Bundled regex-backed helpers now default to post-generation, except `Anti-Slop Regex`
- Greeting messages are now intentionally left untouched by prompt-transform agents
- Added global and per-agent prompt-transform toast notifications
- Added inline run-order editing on agent cards with clearer "lower first" ordering
- Split Pura's Director Preset into SillyBunny and SillyTavern variants

### v1.3.0 (2026-04-12)

- **In-Chat Agents (Beta)**: New custom prompt module system on the Agents page. Users can create, toggle, and share modular RP prompt agents that inject into the generation pipeline.
- Shipped 31 pre-made templates from Pura's Director Preset v12: trackers, randomisers, directives, formatting helpers, anti-slop, and content controls.
- Added Agent Groups for one-click bulk application, connection-profile support for prompt refinement, and one-click transfer from Prompt Manager.
- Agent Mode and In-Chat Agents panels became collapsible drawers, closed by default.

### v1.2.9 (2026-04-11)

- Text Completion and Advanced Formatting settings moved to collapsible drawer sections.
- Added OpenAI Responses API support.
- Added auto-stash before git pull.
- Added AES-256-GCM encrypted secrets at rest and improved auth options.

### v1.2.8 hotfix (2026-04-10)

- Fixed stale group metadata that could point group workflows at a missing chat `.jsonl` after failed creation or rename attempts.
- Existing on-disk group chats are now preferred during recovery, and missing references are repaired instead of trapping the UI in repeated missing-file loops.

### v1.2.8 UI fixes (2026-04-10)

- Added Reset button next to palette presets, improved slider disabled-state feedback, fixed mobile eye toggle double-tap, persona overflow clip, settings grid centering, macOS top-bar border artifact, and a broad border-radius token cleanup pass.

## Rules for experiments

- Build agentic features on `staging` first.
- Keep each experiment narrow and reversible.
- Prefer one capability jump per change:
  - orchestration
  - memory
  - lore autonomy
  - story state
  - action suggestion / narrative guidance
- Record every experiment with the template in [experiment-template.md](/run/media/platinum/HDD/SillyBunny/docs/agentic/experiment-template.md).
- If an experiment changes prompt behavior, document the before/after user-visible effect.
- If an experiment changes stored chat or lore data, document migration and rollback risk.

## Current SillyBunny baseline

- Pre-generation retrieval injection already exists.
- Post-generation memory updates already exist.
- Post-generation lorebook maintenance already exists.
- Agent state is chat-scoped and stored in metadata.
- Agent profiles can reuse the main chat model or use per-service model settings.
- In-Chat Agents can run before generation, after generation, or both, and can optionally use alternate connection profiles.

## Near-term target

Phase 1 is not "full Aventuras". It is:

- a clearer orchestrator around the existing services
- stronger durable memory and retrieval quality
- safer lorebook autonomy
- the first structured story-state layer

See:

- [current-state-map.md](/run/media/platinum/HDD/SillyBunny/docs/agentic/current-state-map.md)
- [milestones.md](/run/media/platinum/HDD/SillyBunny/docs/agentic/milestones.md)
- [experiment-template.md](/run/media/platinum/HDD/SillyBunny/docs/agentic/experiment-template.md)
- [experiments/001-director-layer.md](/run/media/platinum/HDD/SillyBunny/docs/agentic/experiments/001-director-layer.md)
- [experiments/002-durable-memory.md](/run/media/platinum/HDD/SillyBunny/docs/agentic/experiments/002-durable-memory.md)
- [experiments/003-structured-story-state.md](/run/media/platinum/HDD/SillyBunny/docs/agentic/experiments/003-structured-story-state.md)
- [experiments/004-safer-lore-autonomy.md](/run/media/platinum/HDD/SillyBunny/docs/agentic/experiments/004-safer-lore-autonomy.md)
- [experiments/005-agentic-turn-ux.md](/run/media/platinum/HDD/SillyBunny/docs/agentic/experiments/005-agentic-turn-ux.md)
- [experiments/006-agent-preset-import.md](/run/media/platinum/HDD/SillyBunny/docs/agentic/experiments/006-agent-preset-import.md)
