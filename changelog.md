# Changelog

## v1.5.0

Date: 2026-04-26

This is the next main update after `v1.4.2`. It includes the new Group Chat system, the refreshed Workspace/Customize shell, the unified Sampling workspace, improved mobile behavior, token accounting fixes, OpenAI Responses streaming fixes, In-Chat Agent fixes, RAG enablement fixes, the Moonlit Echoes cleanup, and redundant deprecated-code cleanup.

### Group Chats
Group Chats still work for normal group RP: you can pick a group, write as the user, choose who speaks next, and run the scene manually just like before. The new work adds optional tools for people who want the group to feel more like a living conversation, chatroom, party scene, or auto-RP setup without taking away the standard flow.

- Added a bottom group-chat control bar with active speaker selection, Speak Now, manual DM mode, Auto Mode, Auto DM, unread DM badges, and compact mobile controls.
- Added private per-character DM chats. DMs use participant-limited context, show unread badges on character avatars, can be opened with one tap, force DM mode while inside the private chat, and include Return to Group navigation.
- Added Auto Mode for scheduled or autonomous group replies, with per-group persistence, configurable delay, context-aware direct-name replies, group-wide prompts, and anti-loop limits so characters do not rapid-fire forever.
- Added Auto DM for private scheduled messages, including a separate cooldown so background DMs can happen without flooding the user.
- Added AI-generated 24-hour group schedules. SillyBunny can ask the model to create a full-day routine for the group, keep track of local time, catch up after downtime, and optionally let scheduled characters message when their entry is due.
- Improved inter-character conversation prompts so characters can answer, interrupt, agree, disagree, ask questions, or react to other participants instead of only responding to the user.
- Added an active-speaker typing indicator and clearer mobile group controls.
- Fixed group chat saving, branching, Recent Chats registration, empty new chats, custom-name reuse, Auto Mode persistence, draft preservation, unread DM alignment, DM tap targeting, and rapid-fire DM auto-replies.
- Removed redundant old group modes and controls, including Narrator Merge, One at a time, and the old Narrate Turn flow.

### Character Notes
- Made Character Author's Note (Private) editable in group chats and separated group-specific notes from individual chat notes.
- Fixed private note persistence and injection for `Use character author's note` plus `Replace`, `Top`, and `Bottom` placement.

### Workspace, Sampling, And Presets
- Added a unified Sampling workspace/menu for Chat Completions, Text Completions, Kobold/Kobold Horde, and NovelAI.
- Added backend-aware sampler cards, mobile quick access, anchored documentation links, normalized numeric sampler fields, and a Neutralize Samplers action for Chat Completions.
- Updated Geechan's bundled roleplay preset to `Geechan - Universal Roleplay (Chat Completions) (v5.1)` plus matching Text Completions context and system prompt variants, and automatically removes the old bundled v5.0 files from user data during content updates.
- Replaced `Geechan's Chatroom Prompt` with the overhauled `Geechan - Universal Online Chat (Chat Completions) (v1.0)` preset, plus matching Text Completions context and system prompt files.
- Added roomier editing tools, including a resizable first-message field, a desktop World Info pop-up editor, expanded context-size presets, Text Completions preset parity, and better advanced definitions editing.
- Added an OpenRouter/NanoGPT-only `Unlocked Context Size` toggle in Chat Completion token budget settings, preserving SillyBunny's always-unlocked behavior for other providers.
- Fixed preset and settings layout polish, including balanced prompt manager panes, aligned prompt preset controls, equalized Presets dropdown controls, and less-clipped preset action text.

### Chat History, Server Tools, And RAG
- Added Chat History tools for LLM-assisted chat labels, old-chat cleanup, and backup cleanup with previews, confirmations, retention filters, and mobile-friendly controls.
- Added Customize > Server thumbnail controls for format, quality, dimensions, sharp defaults, and per-user cache clearing; sharp PNG thumbnails are now the default.
- Fixed Vector Storage/RAG enablement so legacy saved flags migrate correctly and extensions can turn RAG on through live settings or the shared `SillyTavern.rag` API.
- Fixed OpenAI Responses streaming so expected client disconnects and aborts stop cleanly without noisy `Responses API stream error` logs, while preserving error logging for real upstream stream failures.
- Added Responses API stream coverage for Chat Completions SSE conversion, reasoning deltas, output deltas, and abort suppression.

### In-Chat Agents
- Fixed separated Individual/Group enablement, recovered saved toggles that were missing from scoped state, and made manual agent runs queue instead of disappearing.
- Fixed automatic post-generation runs on desktop and mobile, including late mobile render timing after the generation flag clears and delayed iOS Safari page wakeups.
- Fixed mobile post-processing recovery when iOS Safari misses the generation-ended event, leaves the generation flag stuck, or replaces the rendered message object before queued agents flush.
- Fixed regex-only agents so their formatter scripts attach as soon as an assistant message is received instead of waiting for post-generation processing.
- Fixed in-chat agent regex scripts so they attach during streamed assistant replies and render immediately, matching the native Regex extension timing.
- Fixed in-chat agent post-processing recovery for regenerated assistant replies and preserved prompt-transform diff/undo controls after chat reloads.
- Fixed Impersonate handling so it is treated as user-side generation and no longer runs post-processing, fallback recovery, or regex snapshot mutation against the previous assistant message.
- Fixed prompt-transform runs, transform history, processed-run keys, regex snapshots, and undo/redo controls to use active swipe metadata instead of leaking shared message metadata across swipes.
- Scoped Prose Polisher and agent change history to the active swipe so the document icon only shows edits for the currently visible message.
- Fixed dry-run prompt previews so active pre-generation in-chat agent prompts are included before generation starts, preventing token totals from jumping when the live request begins.
- Prevented mobile render replacements from rerunning post-processing agents that already handled the same generated message.
- Fixed active-swipe regex metadata persistence through chat reloads and prevented Impersonate events from clearing it.
- Added a separate Pathfinder memory summary UI with editable summary text and injection status.
- Fixed Agents Quick Toggles overflow, Pathfinder control alignment, hidden idle cancel buttons, and Pathfinder log detail layout.

### UI And Mobile
- Added a persistent compact mode for the refreshed SillyBunny UI.
- Reworked the default desktop and mobile UI for more consistent spacing, square icon buttons, aligned drawers, normalized dropdowns, readable highlighted text, and a less cramped composer.
- Renamed Navigate to Workspace, shortened the primary character shortcut labels to `FAV.` and `ADV.`, and removed deprecated visible Extras wording.
- Fixed mobile bottom chat controls, send/stop sizing, group avatar spacing, typing indicator alignment, toggle visibility, unread DM badge visibility, avatar refresh flicker, and mobile prompt control alignment.
- Fixed chat and character UI regressions around zoomed avatars, overflowing thumbnails, individual recent chats, group-row alignment, prompt visibility eye buttons, WebKit Ripple rendering, bottom chat spacing, composer panel theming, and first-message top alignment.
- Fixed the refreshed mobile composer so the chat text box and bottom action bar stay compact on narrow screens.
- Restored compact one-line mobile Prompt Manager rows on very narrow screens by keeping prompt names, controls, and token counts aligned in a single row.
- Removed the pill-shaped background from chat message numbers while keeping timer and token metadata spacing intact.
- Fixed reasoning token accounting so locally parsed `<think>`, `<thinking>`, and `<thought>` blocks count as thought tokens while visible message token counts stay scoped to output text.
- Enlarged quick context-size preset labels on mobile and narrow panels so values such as `128 K` and `1 M` fit their buttons cleanly.

### Extensions And Moonlit Echoes
- Removed the bundled Moonlit Echoes extension, built-in Moonlit chat stylesheet, and Echo, Whisper, Hush, Ripple, and Tide options from core Appearance.
- Kept core chat style validation to Flat, Bubbles, and Document; old saved Moonlit style values now reset to Flat and clear legacy body classes.
- Added the SillyBunny-specific Moonlit Echoes fork to Launchpad optional installs.
- Replaced the patched bundled Nemo preset extension with the SillyBunny-owned Bunny Preset Tools local extension, including saved-settings migration and no nested upstream git checkout.
- Fixed duplicate extension settings drawers so repeated extension activation does not create doubled panels.
- Fixed Moonlit Echoes fork styling so enabled Moonlit chat thumbnails and the mobile composer remain usable.

### Maintenance
- Cleaned up launcher installs so routine starts are quieter, preserve ESLint dependencies, and avoid unnecessary dependency work when runtime inputs have not changed.
- Fixed lint coverage by including `scripts/**/*.js` in the standard ESLint target and resolving the existing lint failures.
- Fixed frontend cache clearing after updater reloads.
- Removed unused deprecated server utilities for mutable config writes and direct HTTP/2 requests, including the now-unused `node:http2` import.
- Removed unused deprecated Express parser aliases that were superseded by application-level middleware.
- Removed redundant root package metadata, dropped unused direct Chevrotain types, and moved test-only ESLint plugin ownership into the nested `tests` package.
- Cleaned up test lint references so nested test lint runs without warnings or undefined globals.
- Kept `public/scripts/f-localStorage.js` in place for extension compatibility.
- Bumped app-owned version strings to `1.5.0` without changing dependency versions.

Commits:
- `feat(ui): expose context unlock for nanogpt and openrouter`
- `fix(agents): apply regex scripts during streaming`
- `fix(agents): recover regenerated post-processing history`
- `fix(agents): scope transform history to active swipe`
- `fix: stabilize token accounting and mobile agents`
- `fix: stabilize responses streaming and agent swipes`
- `chore(presets): refresh Geechan bundled presets`
- `chore: remove redundant deprecated code`
- `fix(ui): remove message number background`

## v1.4.1

Date: 2026-04-23

Changes:
- Restored World Info entry enable/disable behavior and tightened the World Info layout with smaller cards, narrower popup rows, and cleaner mobile/desktop spacing.
- Added selectable multi-delete pickers for saved presets and connection profiles instead of delete-all-only flows.
- Improved Pathfinder usability with clearer tool-mode diagnostics, persisted tool toggles like Update and Forget, and a detailed retrieval log showing selected lore entries, stage results, and injected Pathfinder context.
- Kept List Only mode focused on recent chats by removing its extra shortcut row, while also cleaning up home-screen preset copy so only the bundled SillyBunny-tuned Director preset is promoted.
- Polished shell/UI consistency by aligning the reasoning token badge, matching bottom-bar sizing to the top bar, and preserving transparency for cropped avatars and alpha-capable thumbnails.
- Hardened self-update behavior so existing Node/npm installs no longer dirty `package-lock.json` during routine updates.
- Bumped the app version strings and default-user settings version to `1.4.1`.

- Fixed `NetworkError: failed to fetch resource` on zip import by ensuring the uploads directory is always created on startup before multer uses it as its destination.

Commits:
- `fix(ui): ship v1.4.1 lorebook and shell polish`
- `fix(ui): tighten home and updater polish`
- `fix(ui): refine pathfinder and selective deletes`
- `fix(ui): add pathfinder retrieval logging`
- `fix(server): ensure uploads dir exists before multer`
