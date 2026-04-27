# 🐰 SillyBunny 🐰
<div>
<img src=".github/screenshots/banner.jpg" width="100%">
</div>

---

An elegant fork of [SillyTavern](https://github.com/SillyTavern/SillyTavern), designed with a cleaner, graphical shell UI; Bun-based backend; built-in tutorials, presets, extensions, and a quick-start dashboard; and a lightweight agnetic system to faciliate modern agent functionality.

> [!WARNING]
> This is an in-dev fork, and is considered beta quality. [Please direct SillyBunny-specific issues to this project's issue tracker.](https://github.com/platberlitz/SillyBunny/issues) If an issue is reproducible in upstream SillyTavern, please report it upstream instead.
>
> Disclaimer: LLMs are used to facilitate development of this fork. Overall software design, prompting, testing, and documentation are handled by humans. To keep things simple, we try to maintain close to upstream as possible.

<details>
<summary><h2>Screenshots</h2></summary>

These screenshots show the graphical shell UI across Workspace, Customize, Agents, Characters, Search, and a Bunny Guide in-chat view on desktop and mobile.

#### Desktop

| Desktop Workspace Menu | Desktop Customize Menu |
| :---: | :---: |
| <img src=".github/screenshots/sillybunny-ui-desktop-navigate-v1.4.0.png" alt="Desktop Workspace Menu" width="100%"> | <img src=".github/screenshots/sillybunny-ui-desktop-customize-v1.4.0.png" alt="Desktop Customize Menu" width="100%"> |

| Desktop Agents Menu | Desktop Characters Menu |
| :---: | :---: |
| <img src=".github/screenshots/sillybunny-ui-desktop-agents-v1.4.0.png" alt="Desktop Agents Menu" width="100%"> | <img src=".github/screenshots/sillybunny-ui-desktop-characters-v1.4.0.png" alt="Desktop Characters Menu" width="100%"> |

| Desktop Search | Desktop Chat |
| :---: | :---: |
| <img src=".github/screenshots/sillybunny-ui-desktop-search-v1.4.0.png" alt="Desktop Search" width="100%"> | <img src=".github/screenshots/sillybunny-ui-desktop-in-chat-v1.4.0.png" alt="Desktop Bunny Guide Chat" width="100%"> |

#### Mobile

| Mobile Workspace Menu | Mobile Customize Menu | Mobile Agents Menu |
| :---: | :---: | :---: |
| <img src=".github/screenshots/sillybunny-ui-mobile-navigate-v1.4.0.png" alt="Mobile Workspace Menu" width="100%"> | <img src=".github/screenshots/sillybunny-ui-mobile-customize-v1.4.0.png" alt="Mobile Customize Menu" width="100%"> | <img src=".github/screenshots/sillybunny-ui-mobile-agents-v1.4.0.png" alt="Mobile Agents Menu" width="100%"> |

| Mobile Characters Menu | Mobile Search | Mobile Chat |
| :---: | :---: | :---: |
| <img src=".github/screenshots/sillybunny-ui-mobile-characters-v1.4.0.png" alt="Mobile Characters Menu" width="100%"> | <img src=".github/screenshots/sillybunny-ui-mobile-search-v1.4.0.png" alt="Mobile Search" width="100%"> | <img src=".github/screenshots/sillybunny-ui-mobile-in-chat-v1.4.0.png" alt="Mobile Bunny Guide Chat" width="100%"> |

</details>

---

## Table of Contents
* [At a Glance](#at-a-glance)
* [Installation](#installation)
    * [macOS Notes](#macos-notes)
    * [Termux (Android) Notes](#termux-android-notes)
    * [Update Instructions](#how-to-update)
* [Project Goals](#project-goals-aka-why-we-made-this-fork)
* [Changes Compared to SillyTavern](#changes-vs-sillytavern)
* [Latest Update](#latest-update)
    * [v1.5.0 (2026-04-26)](#v150-2026-04-26)
* [Upstream Information](#upstream-information)
* [Contributors](#contributors)
***

## At a glance

| | |
|-|-|
| **UI** | Custom navigation shell with search, themes, and mobile layout |
| **Runtime** | Bun (auto-installed), Node.js fallback |
| **Bundled Goodies** | Pre-bundled RP presets, complementary extensions, and additional themes, alongside built-in detailed tutorials |
| **Agents** | Built-in In-Chat Agents for modular RP prompting |
| **Data** | Drop-in compatible with SillyTavern settings, characters, chats, presets, and extensions |
| **Default port** | `4444` |

---

## Installation

[Grab the latest release here.](https://github.com/platberlitz/SillyBunny/releases/latest)

Or run:

```bash
git clone https://github.com/platberlitz/SillyBunny.git
cd SillyBunny
```

Then, run the appropriate launcher for your OS, which auto-installs all dependencies, checks for updates, and starts a server instance. You can also open `http://127.0.0.1:4444` manually in your browser.

| Platform | Command |
|----------|---------|
| Windows | `.\Start.bat` |
| macOS (Terminal) | `./Start.command` |
| macOS (Finder) | Double-click `Start.command` (right-click > Open if Gatekeeper warns) |
| Linux / WSL | `./start.sh` |
| Docker | `docker compose -f docker/docker-compose.yml up --build`
| Android (Termux) | `bash start.sh` |

If you already manage your own Bun install, run via `bun run start`. Other launch variants:

```bash
bun run start:mobile   # lower-memory (--smol)
bun run start:global   # SillyBunny-owned data paths
bun run start:no-csrf  # disable CSRF (local dev)
```

### macOS notes

- If the launcher window closes too fast, run `./Start.command` from Terminal to keep output visible
- If Git is missing, the launcher triggers `xcode-select --install` automatically
- Quarantine metadata from ZIP downloads: `xattr -dr com.apple.quarantine /path/to/SillyBunny`
- Stripped permissions from unzip: `chmod +x Start.command start.sh scripts/*.sh`

### Termux (Android) notes

```bash
pkg update && pkg upgrade -y
pkg install -y git curl unzip
git clone https://github.com/platberlitz/SillyBunny.git
cd SillyBunny
bash start.sh
```

- The launcher defaults to Node.js + npm on native Termux (more reliable than Bun under grun)
- To force Bun anyway: `SILLYBUNNY_TERMUX_RUNTIME=bun bash start.sh`
- For shared storage access: `termux-setup-storage` once before starting
  
### How to Update

| What you want | Command |
|---------------|---------|
| Update from the running app | Open Customize > Server and use the built-in updater |
| Normal launch (auto-checks for updates) | `./start.sh` |
| Force update then launch | `./start.sh --self-update` |
| Update only, don't start | `./start.sh --self-update-only` |
| Skip update check once | `./start.sh --skip-self-update` |
| Disable auto-update permanently | `SILLYBUNNY_AUTO_UPDATE=0 ./start.sh` |

---

## Project Goals (AKA, why we made this fork)

Our primary goals for SillyBunny are as follows:

1) **Simple by default; powerful when needed.** Directly inspired by KDE Plasma's main driving philosophy, SillyBunny is aimed to be simple to understand and intuitive to use by default, with most of the complex settings hidden away from the default workspace. Sane defaults are implemented while all the extra complexity is hidden behind UI elements: still there, but less obtrusive. Our graphical shell best embodies this philosophy.
2) **A focus on roleplay and storytelling.** SillyBunny has a more opinionated purpose compared to upstream SillyTavern. Our goals align closely with the creative writing scene for models, and the general direction of the fork is aimed for that use case. We facilitate this with pre-bundled tutorials/add-ons/presets designed to get you started with LLM creative writing in fun ways.
3) **Modernised features.** We aim to implement new features that can greatly take advantage of modern models and their strong, agnetic capabilities. Currently, this includes full support for In-Chat pre and post gen agents that complement the main generation. Models work best on smaller individual tasks, and this is best shown through in-chat agents and their capabilities. We're also looking into features like an RPG game mode that can take advantage of these agents.
4) **Better performance.** Base SillyTavern relies on node.js for its runtime environment. While robust, this is not ideal for performance. We've switched to a Bun runtime to increase general performance and startup times, while optimising for lower power devices like smartphones.
5) **Compatibility**. We remain as closely backwards compatible with upstream SillyTavern as possible. This facilitates easy synchronizing with upstream. We aim to not remove any pre-existing features, unless replacing with a direct alternative. The backend is already very solid, so primary work is done in the frontend space. In addition, we aim to make all our new features compatible with models of all sizes, not just the frontier, SOTA ones. Simplicity is key.

---

## Changes vs. SillyTavern

### Different UI

The original SillyTavern layout is replaced with a custom, easy-to-navigate graphical shell:

- **Top bar**: Reworked with cleaner, better-defined nested menus. Includes Workspace, Customize, Home, and Characters.
- **Bottom bar**: New bottom bar designed for quick access to persona switching, quick chat switching, and add/edit/remove existing chat functionality.
- **Panel-oriented navigation**: Easy access to all settings in nested panels. Collapsible settings sections in both Chat Completions and Text Completions presets.
- **Global search**: A global search bar that queries across presets, lore, extensions, personas, and settings at once.
- **Platform-aware**: Designed for both desktop and mobile, with a dedicated phone/tablet navigation layer.
- **Three modern shell themes**: Modern Glass, Clean Minimal, Bold Stylized.
- **Palette customization**: Easily change the accent colour of any theme you're currently using.

### Bun-first runtime

We primarily use Bun as a runtime, instead of node.js. This results in consistently faster startups, overall performance, and automatic launcher bootstraping. Node.js is still fully functional as a legacy fallback system.

### In-Chat Agnetic Support

SillyBunny has support for In-Chat Agents. These are custom prompt fields that can run separately from the main generation, which allows for a lot of extra flexibility. Included are several pre-built prompts designed for trackers, post-gen cleanup, anti-slop, and more. Agents can use the main model or a different connection profile, allowing for a fast, smaller model to run long agnetic tasks with ease while a large, main model writes the actual story content. These are designed to fill the gap between full extensions and simple, modular agnetic functionality.

**Pipeline:**

1. **Pre-generation agents** injects prompt text before the main reply is generated.
2. **Main Model** writes the main RP reply.
3. **Post-generation agents** optionally rewrites the contents of the main response, or appends extra content after the reply.
4. **Post-process utilities** can extract structured data, run regex cleanup/formatting, or preserve machine-readable blocks while showing cleaner UI.
5. **Groups and templates** let you swap whole stacks quickly without editing your base preset every time.

**Typical Usecases:**

- Trackers for scene, time, items, relationships, off-screen activity, and world state.
- Writing cleanup passes like anti-slop or regex-based formatting.
- Formatting helpers like direction menus, CYOA choices, or NPC profile cards.
- Randomisers and directives that change the pressure, genre, pacing, or escalation of a scene.
- Content toggles for prose style, difficulty, POV, and HTML artifacts.
- Agentic lorebook navigation for on-demand retrieval, memory maintenance, and tree building.
- Cheap helper-model passes that prepare or polish content without spending your main model's budget.

**Included Agents**

* **Trackers:** Achievements, CYOA Choices, Direction Menu, Event, Item, NPC Profiles, Parallel Off-Screen, Relationship, Reputation, Scene, Secrets, Status, Time, and World Detail.
* **Randomizers:** Chaos Mode, Combined Director's Cut, Dead Dove Escalation, Genre, Grounded Complication, Intimacy & Kink, Scene Driving Force, and Scene Pressure Cocktail.
* **Content:** Difficulty Increase, Don't Write for User, Friction Mode, Grounded Prose, HTML Toggle, and Write for User.
* **Post Generation Editors:** Prose Polisher
* **Additional Agents:** Pathfinder (an agentic lorebook navigator with 8 tools for retrieval, memory maintenance, and tree building).

**Agent Behaviors and Settings**
* Agentic prompts feature inline run-order editing, click-to-edit functionality, and fullscreen prompt editors.
* Agents use the main connection profile by default with an 8192 max token limit. Separate connection profile support is available when explicitly selected.
* Bundled trackers, including CYOA Choices, are configured for pre-generation. The main model emits clickable options directly in the response.
* All bundled tracker and menu agents default to the User injection role to maintain compatibility with models that deprioritize System injections.
* Built-in groups are available for the full preset, trackers only, and randomizers only.
* Custom agents support ST-style regex options.

### Bundled Goodies & Tutorials
SillyBunny includes some extras by default to help you get started right away:
* A tutorial that guides you through the SillyBunny interface.
* Pre-bundled roleplay presets from purachina and Geechan.
* A character card conversion preset from TLD to help you generate character cards from scratch, or convert from existing cards to a better format.
* A friendly quick-start guide with optional recommended extensions (Summary Sharder, Dialogue Colours, Quick Image Gen, Guided Generations, CSS Snippets).
* Two custom assistants to help you get started - Bunny Guide, and Assistant Nahida.

---

## Latest Update

### v1.5.0 (2026-04-26)

This is the next main update after `v1.4.2`. It includes the new Group Chat system, rewording some UI elements, a unified Sampling workspace, improved mobile behavior, token accounting fixes, OpenAI Responses streaming fixes, In-Chat Agent fixes, RAG enablement fixes, cleaning up unnecessary dependencies, and redundant deprecated-code cleanup.

#### Group Chats
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

#### Character Notes
- Made Character Author's Note (Private) editable in group chats and separated group-specific notes from individual chat notes.
- Fixed private note persistence and injection for `Use character author's note` plus `Replace`, `Top`, and `Bottom` placement.

#### Workspace, Sampling, And Presets
- Added a unified Sampling menu in the Workspace menu for Chat Completions and Text Completions. This also migrates seed and logit bias information from Chat Completions to a more logical place, and includes a Neutralize Samplers button for Chat Completions.
- Updated Geechan's bundled roleplay preset to `Geechan - Universal Roleplay (Chat Completions) (v5.1)` plus matching Text Completions context and system prompt variants.
- Replaced `Geechan's Chatroom Prompt` with the overhauled `Geechan - Universal Online Chat (Chat Completions) (v1.0)` preset, plus matching Text Completions context and system prompt files.
- Updated `Pura's Director Preset (SillyBunny)` to version `13.0` and removed the separate SillyTavern variant from bundled content.
- Added roomier editing tools, including a resizable first-message field, a desktop World Info pop-up editor, expanded context-size presets, Text Completions preset parity, and better advanced definitions editing.
- Added an OpenRouter/NanoGPT-only `Unlocked Context Size` toggle in Chat Completion token budget settings, preserving SillyBunny's always-unlocked behavior for other providers.
- Fixed preset and settings layout polish, including balanced prompt manager panes, aligned prompt preset controls, equalized Presets dropdown controls, and less-clipped preset action text.
- Fixed Prompt Manager token attribution so the Main Prompt row shows the Main Prompt text itself instead of inheriting surrounding injected prompt totals.

#### Chat History, Server Tools, And RAG
- Added Chat History tools for LLM-assisted chat labels, old-chat cleanup, and backup cleanup with previews, confirmations, retention filters, and mobile-friendly controls.
- Added Customize > Server thumbnail controls for format, quality, dimensions, sharp defaults, and per-user cache clearing; sharp PNG thumbnails are now the default.
- Fixed Vector Storage/RAG enablement so legacy saved flags migrate correctly and extensions can turn RAG on through live settings or the shared `SillyTavern.rag` API.
- Fixed OpenAI Responses streaming so expected client disconnects and aborts stop cleanly without noisy `Responses API stream error` logs, while preserving error logging for real upstream stream failures.
- Added Responses API stream coverage for Chat Completions SSE conversion, reasoning deltas, output deltas, and abort suppression.

#### In-Chat Agents
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

#### UI And Mobile
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

#### Extensions And Moonlit Echoes
- Removed the bundled Moonlit Echoes extension, built-in Moonlit chat stylesheet, and Echo, Whisper, Hush, Ripple, and Tide options from core Appearance.
- Kept core chat style validation to Flat, Bubbles, and Document; old saved Moonlit style values now reset to Flat and clear legacy body classes.
- Added the SillyBunny-specific Moonlit Echoes fork to Launchpad optional installs.
- Added a warning-only Moonlit Echoes update toast that points affected users to the fork without disabling or changing saved theme settings.
- Replaced the patched bundled Nemo preset extension with the SillyBunny-owned Bunny Preset Tools local extension, including saved-settings migration and no nested upstream git checkout.
- Fixed duplicate extension settings drawers so repeated extension activation does not create doubled panels.
- Fixed Moonlit Echoes fork styling so enabled Moonlit chat thumbnails and the mobile composer remain usable.

#### Maintenance
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

[Find other changelogs in our Releases.](https://github.com/platberlitz/SillyBunny/releases)

---

## Upstream Information

SillyBunny is a fork of SillyTavern. Most SillyTavern behavior, data formats, and ecosystem knowledge still apply. Please report SillyBunny-specific issues here, while reporting SillyTavern adjacent issues upstream.

| Resource | Link |
|----------|------|
| Upstream repo | [SillyTavern/SillyTavern](https://github.com/SillyTavern/SillyTavern) |
| Upstream docs | [docs.sillytavern.app](https://docs.sillytavern.app/) |
| Discord | [discord.gg/sillytavern](https://discord.gg/sillytavern) |
| Subreddit | [r/SillyTavernAI](https://reddit.com/r/SillyTavernAI) |

If something feels off, compare against the upstream `release` branch first.

## Contributors

- [Platberlitz](https://github.com/platberlitz)
- [Geechan](https://github.com/Geechan)
- [TheLonelyDevil9](https://github.com/TheLonelyDevil9)

[Licensed as free software under the AGPL-3.0.](https://www.gnu.org/licenses/agpl-3.0.en.html)
