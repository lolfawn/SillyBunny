# 006: Agent Preset Import

## Title

Import a chat preset and apply its compatible tuning to SillyBunny's utility agents.

## Goal

Let the Retrieval, Memory, and Lorebook agents inherit useful completion tuning from an existing chat preset without turning those agents into full scene-writing personas.

## Inspiration

You already have strong hand-tuned presets, and Agent Mode becomes much easier to iterate on if those presets can be reused instead of re-entering the same temperature, token, and reasoning knobs three times.

## Files touched

- [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js)
- [public/index.html](/run/media/platinum/HDD/SillyBunny/public/index.html)

## Hypothesis

If Agent Mode can import the compatible runtime knobs from a chat preset, agent behavior becomes easier to align with an existing setup while preserving the agent-specific instructions that make retrieval, memory, and lore maintenance work.

## User-visible change

- Agent Mode now has an `Apply Chat Preset To Agents` button.
- Agent Mode now has a `Clear Agent Preset` button.
- The panel shows whether an agent preset is imported and how many compatible settings were applied.
- Imported temperature and max-token values are pushed into all three visible agent profiles so they stay editable after import.

## What gets imported

Compatible runtime fields currently include:

- `temperature`
- `frequency_penalty`
- `presence_penalty`
- `top_p`
- `top_k`
- `min_p`
- `top_a`
- `repetition_penalty`
- `openai_max_tokens`
- `assistant_prefill`
- `assistant_impersonation`
- `use_sysprompt`
- `show_thoughts`
- `reasoning_effort`
- `verbosity`
- `enable_web_search`
- `seed`

## What does not get imported yet

- Prompt-manager prompt blocks such as `main`, `jailbreak`, `nsfw`, custom injected prompts, and `prompt_order`.
- Extension payloads such as regex scripts.
- Image-generation request settings.
- Provider connection details that are outside the current agent profile model.

## Why prompt blocks are excluded

The current agent services are utility workers with their own fixed instructions:

- Retrieval gathers context.
- Memory updates durable state.
- Lorebook proposes or applies world knowledge changes.

Importing a full scene-writing preset prompt stack into those workers would likely make them verbose, roleplay in the wrong place, or stop using tools cleanly. For now, the import is intentionally scoped to agent-safe completion settings.

## Bug-test checklist

- Open a chat, expand Agent Mode, and click `Apply Chat Preset To Agents`.
- Import a JSON preset such as `Pura's Director Preset 11.5 beta 1.json`.
- Confirm the status line updates and reports an imported preset.
- Confirm Retrieval, Memory, and Lorebook temperatures change to the imported preset's temperature.
- Confirm all three max-token inputs change to the imported preset's max-token value.
- Run a few turns with Agent Mode enabled and confirm the agents still complete their normal jobs:
  - retrieval still produces concise context
  - memory still updates summary and story state
  - lorebook still proposes or applies lore changes
- Toggle `Clear Agent Preset` and confirm the imported overlay is removed while the current visible per-agent profile values remain editable.

## Known limitations before bug testing

- The imported preset affects runtime tuning, not the agent instruction prompts.
- Imported values are global Agent Mode settings, not per-chat metadata.
- If a preset contains only custom prompt logic and almost no compatible runtime settings, import will reject it.

## Rollback plan

If this import path causes confusing behavior, remove the shared preset overlay and keep the original per-service profile controls as the only tuning mechanism.
