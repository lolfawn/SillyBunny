# Changelog

## Unreleased

Date: 2026-04-29

This update restores Prose Polisher coverage for guided impersonation workflows, makes Advanced Formatting a first-class workspace tab again, adds conservative startup-loading improvements for desktop and mobile, and polishes cross-platform UI alignment, focus, safe-area, and touch-target behavior.

### In-Chat Agents
- Added an opt-in prompt-pass condition for generated impersonation text so Prose Polisher can rewrite Guided Generations impersonations without mutating the previous assistant message.
- Shipped the bundled Prose Polisher template with impersonation polishing enabled, while keeping the new behavior off by default for other prompt-pass agents.
- Added editor UI and migration support for saved bundled Prose Polisher agents, plus unit coverage for both opted-out and opted-in impersonation behavior.

### Workspace And Formatting
- Promoted Advanced Formatting into its own left workspace tab immediately after Sampling.
- Kept the Formatting tab visible across backends instead of hiding the whole Advanced Formatting drawer outside Text Completions.

### Loading
- Deferred ordered classic library scripts, preloaded startup modules, and limited the mobile stylesheet to mobile viewports.
- Added a guarded service worker that stale-while-revalidates static library, CSS, image, and webfont assets while using network-first handling for HTML and JavaScript.

### UI Polish
- Replaced clipped outer focus outlines and oversized active-control shadows with inset rings so focused and highlighted controls stay inside rounded containers.
- Aligned shell headers, character drawer padding, welcome headers, and checkbox labels across desktop and mobile breakpoints.
- Normalized mobile safe-area fallbacks and 44 px tap targets for the composer, bottom chat controls, and welcome recent-chat actions.
- Cleaned up redundant shell borders, trailing recent-chat stat dividers, and duplicated macOS browser chrome patches.

### Local Commits
- `1f3c9b3 feat(agents): allow prompt passes on impersonations`
- `c6f8903 feat(shell): promote advanced formatting to workspace tab`
- `887be36 perf(loading): defer startup assets and cache statics`
- `de68413 fix(ui): replace clipped focus outlines with inset focus rings`
- `1434631 fix(ui): align headers drawer padding and shell title`
- `1f1fdd6 fix(ui): align checkbox layouts across breakpoints`
- `88ccda0 fix(mobile): normalize safe areas and tap targets`
- `cf7ea0a fix(ui): clean up borders and browser chrome patches`

## v1.5.1

Date: 2026-04-29

This patch focuses on persistence and restart fixes for the new agentic and admin workflows introduced around `v1.5.0`.

### Chat And Reasoning
- Persisted collapsed thinking/reasoning block state per message so user-expanded or user-collapsed reasoning blocks survive chat switches and reloads.

### Pathfinder
- Added an independent Pathfinder enable switch in settings so saving books, modes, or prompt settings no longer toggles Pathfinder off unexpectedly.
- Preserved nested Pathfinder settings, including pipeline prompts, custom pipelines, book permissions, and tool confirmations, instead of resetting omitted fields back to defaults.
- Raised Pathfinder pipeline stage output limits from `1024` to `32000` tokens by default and exposed the stage max-token setting in both prompt editors.

### Server Admin
- Fixed frontend Save & Restart and update restarts when launched from the provided Linux, macOS, and Windows launchers so the server relaunches in the same terminal instead of becoming a detached silent process.

## v1.5.0

Date: 2026-04-26

This is the next main update after `v1.4.2`. It includes the new Group Chat system, rewording some UI elements, a unified Sampling workspace, improved mobile behavior, token accounting fixes, OpenAI Responses streaming fixes, In-Chat Agent fixes, RAG enablement fixes, cleaning up unnecessary dependencies, and redundant deprecated-code cleanup.

### Group Chats
Group Chats still work for normal group RP: you can pick a group, write as the user, choose who speaks next, and run the scene manually just like before. The new group chat system adds optional tools for people who want the group to feel more like a living conversation, chatroom, party scene, or auto-RP setup.

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
- Added a unified Sampling menu in the Workspace menu for Chat Completions and Text Completions. This also migrates seed and logit bias information from Chat Completions to a more logical place, and includes a Neutralize Samplers button for Chat Completions.
- Updated Geechan's bundled roleplay preset to `Geechan - Universal Roleplay (Chat Completions) (v5.1)` plus matching Text Completions context and system prompt variants.
- Replaced `Geechan's Chatroom Prompt` with the overhauled `Geechan - Universal Online Chat (Chat Completions) (v1.0)` preset, plus matching Text Completions context and system prompt files.
- Updated `Pura's Director Preset (SillyBunny)` to version `13.0` and removed the separate SillyTavern variant from bundled content.
- Added roomier editing tools, including a resizable first-message field, a desktop World Info pop-up editor, expanded context-size presets, Text Completions preset parity, and better advanced definitions editing.
- Added an OpenRouter/NanoGPT-only `Unlocked Context Size` toggle in Chat Completion token budget settings, preserving SillyBunny's always-unlocked behavior for other providers.
- Fixed preset and settings layout polish, including balanced prompt manager panes, aligned prompt preset controls, equalized Presets dropdown controls, and less-clipped preset action text.
- Fixed Prompt Manager token attribution so the Main Prompt row shows the Main Prompt text itself instead of inheriting surrounding injected prompt totals.

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
- Hardened mobile post-processing guards so delayed automatic render/receive events cannot rerun agents after generated timestamp metadata changes.
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
- Aligned the mobile Quick Actions menu with fixed icon and label columns so every row starts and justifies consistently.

### Extensions And Moonlit Echoes
- Removed the bundled Moonlit Echoes extension, built-in Moonlit chat stylesheet, and Echo, Whisper, Hush, Ripple, and Tide options from core Appearance.
- Kept core chat style validation to Flat, Bubbles, and Document; old saved Moonlit style values now reset to Flat and clear legacy body classes.
- Added the SillyBunny-specific Moonlit Echoes fork to Launchpad optional installs.
- Added a warning-only Moonlit Echoes update toast that points affected users to the fork without disabling or changing saved theme settings.
- Replaced the patched bundled Nemo preset extension with the SillyBunny-owned Bunny Preset Tools local extension, including saved-settings migration and no nested upstream git checkout.
- Fixed duplicate extension settings drawers so repeated extension activation does not create doubled panels.
- Fixed Moonlit Echoes fork styling so enabled Moonlit chat thumbnails and the mobile composer remain usable.

### Maintenance
- Cleaned up launcher installs so routine starts are quieter, preserve ESLint dependencies, and avoid unnecessary dependency work when runtime inputs have not changed.
- Fixed Basic auth plus account-login sessions so module assets such as `/lib.js` keep loading after login on mobile browsers, and made unauthorized auth pages non-cacheable.
- Fixed lint coverage by including `scripts/**/*.js` in the standard ESLint target and resolving the existing lint failures.
- Fixed frontend cache clearing after updater reloads.
- Removed unused deprecated server utilities for mutable config writes and direct HTTP/2 requests, including the now-unused `node:http2` import.
- Removed unused deprecated Express parser aliases that were superseded by application-level middleware.
- Removed redundant root package metadata, dropped unused direct Chevrotain types, and moved test-only ESLint plugin ownership into the nested `tests` package.
- Cleaned up test lint references so nested test lint runs without warnings or undefined globals.
- Kept `public/scripts/f-localStorage.js` in place for extension compatibility.
- Bumped app-owned version strings to `1.5.0` without changing dependency versions.
