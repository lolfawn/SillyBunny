<!-- This file mirrors the root README so GitHub renders the correct project homepage copy. -->

# SillyBunny

An elegant fork of [SillyTavern](https://github.com/SillyTavern/SillyTavern), designed with a cleaner, shell-based UI, Bun-based backend, and a lightweight agnetic system to faciliate modern agent functionality.

You can find more information, presets, themes, and extras here: [platberlitz.github.io](https://platberlitz.github.io/)

> [!WARNING]
> This is an active fork, and is considered beta quality. [Please direct all issues to this project's issue tracker.](https://github.com/platberlitz/SillyBunny/issues)
---
## At a glance

| | |
|-|-|
| **UI** | Custom navigation shell with search, themes, and mobile layout |
| **Runtime** | Bun (auto-installed), Node.js fallback |
| **Agents** | Built-in In-Chat Agents for modular RP prompting |
| **Data** | Drop-in compatible with SillyTavern settings, characters, chats, presets, and extensions |
| **Default port** | `4444` |

---

## User Interface

These screenshots show the new shell-based UI across Navigate, Customize, Agents, and Characters on desktop and mobile.

#### Default shell

##### Desktop

![SillyBunny desktop Navigate](https://raw.githubusercontent.com/platberlitz/SillyBunny/main/docs/assets/readme/sillybunny-ui-desktop-navigate-v1.3.6.png)

![SillyBunny desktop Customize](https://raw.githubusercontent.com/platberlitz/SillyBunny/main/docs/assets/readme/sillybunny-ui-desktop-customize-v1.3.6.png)

![SillyBunny desktop Agents](https://raw.githubusercontent.com/platberlitz/SillyBunny/main/docs/assets/readme/sillybunny-ui-desktop-agents-v1.3.6.png)

![SillyBunny desktop Characters](https://raw.githubusercontent.com/platberlitz/SillyBunny/main/docs/assets/readme/sillybunny-ui-desktop-characters-v1.3.6.png)

##### Mobile

![SillyBunny mobile Navigate](https://raw.githubusercontent.com/platberlitz/SillyBunny/main/docs/assets/readme/sillybunny-ui-mobile-navigate-v1.3.6.png)

![SillyBunny mobile Customize](https://raw.githubusercontent.com/platberlitz/SillyBunny/main/docs/assets/readme/sillybunny-ui-mobile-customize-v1.3.6.png)

![SillyBunny mobile Agents](https://raw.githubusercontent.com/platberlitz/SillyBunny/main/docs/assets/readme/sillybunny-ui-mobile-agents-v1.3.6.png)

![SillyBunny mobile Characters](https://raw.githubusercontent.com/platberlitz/SillyBunny/main/docs/assets/readme/sillybunny-ui-mobile-characters-v1.3.6.png)

---

## Quick start

```bash
git clone https://github.com/platberlitz/SillyBunny.git
cd SillyBunny
```

Then run the launcher for your OS, which auto-installs all dependencies, checks for updates, and starts a server instance. You can also open `http://127.0.0.1:4444` manually in your browser.

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

---

### Update controls

| What you want | Command |
|---------------|---------|
| Normal launch (auto-checks for updates) | `./start.sh` |
| Force update then launch | `./start.sh --self-update` |
| Update only, don't start | `./start.sh --self-update-only` |
| Skip update check once | `./start.sh --skip-self-update` |
| Disable auto-update permanently | `SILLYBUNNY_AUTO_UPDATE=0 ./start.sh` |

---

## Changes vs. SillyTavern

### Different UI

The original SillyTavern layout is replaced with a custom navigation shell:

- **Left/right panel navigation** for workspace and customization
- **Search-first** across presets, lore, extensions, personas, and settings
- **Mobile-aware** with a dedicated phone/tablet navigation layer
- **Collapsible settings sections** in both Chat Completions and Text Completions presets
- **Extra shell themes**: Modern Glass, Clean Minimal, Bold Stylized, etc.
- **Extra palette presets**: Forest Dusk, Forest Dawn, Rose Glow, etc.

### Bun-first runtime

Instead of node.js, this fork uses Bun. This results in consistently faster startups and automatic launcher bootstraping. Node.js is still fully functional as a fallback system.

### In-Chat Agnetic Support

SillyBunny has support for In-Chat Agents. These are custom prompt fields that can run separately from the main generation, which allows for a lot of extra flexibility. Included are several pre-built prompts designed for trackers, post-gen cleanup, anti-slop, and more. Agents can use the main model or a different connection profile, allowing for a fast, smaller model to run long agnetic tasks with ease while a large, main model writes the actual story content.

This feature is currently in beta. These are designed to fill the gap between full extensions and simple, modular agnetic functionality.

**Pipeline:**

1. **Pre-generation agents** injects prompt text before the main reply is generated.
2. **Main Model** writes the main RP reply.
3. **Post-generation agents** optionally rewrites the contents of the main response, or appends extra content after the reply.
4. **Post-process utilities** can extract structured data, run regex cleanup/formatting, or preserve machine-readable blocks while showing cleaner UI.
5. **Groups and templates** let you swap whole stacks quickly without editing your base preset every time.

**Typical uses:**

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

---

## Changelog

### v1.3.6 (2026-04-16)

**Startup and shell reliability**

- Fixed a slow-start race on Node.js, especially on VPS and Oracle Cloud-style environments, where the top bar and shell chrome could fail to initialize until the page was refreshed multiple times
- Added retry-safe shell/bootstrap initialization so late DOM insertion still finishes building the top bar and chat tools on first load
- Restored live chat/profile refresh binding for the top shell tools so connection and chat selectors stay in sync after delayed UI mount

**Streaming and swipe fixes**

- Fixed stopping a streaming generation leaving SillyBunny stuck in a "still generating" state, which could block sending, Home navigation, swiping, or opening other cards until a full refresh
- Cancel now immediately unlocks the UI and clears the active stream cleanly instead of waiting for a later error path to finish cleanup
- Fixed swipe-generated alternates re-running post-generation agents after the earlier Guided Generations fix, so normal swipes no longer trigger duplicate post passes that already ran on the original turn

**Connection profiles and logs**

- Fixed In-Chat Agents default profile fallback so blank/default agent profile settings now follow the live Connection Manager selection instead of silently using only the currently enabled API setting
- Added profile UI refresh hooks so Connection Manager profile changes, creation, updates, and deletion stay aligned with what agent cards and dropdowns show
- In-Chat Agent prompt-transform notifications now show the Connection Manager profile display name instead of the raw internal profile id, so running-agent toasts read the exact profile name you picked
- Restored short text previews in Google AI Studio debug logs while keeping the safer summarized logging format, so requests and responses show enough visible content to debug prompts again without dumping full payloads

### v1.3.3 (2026-04-14)

**Shell and responsive UI**

- Redesigned shell panels: centered on screen, narrower (900px max), horizontal tab bar at top instead of vertical sidebar
- Centered shell animations: Navigate, Customize, and Characters now open with a scale-and-fade from center
- Rearranged top bar: Navigate + Customize on the left, Home + Characters on the right, removed duplicate API button
- Added customizable quick-access shortcut buttons in the top bar (configurable in Settings)
- Added desktop corner resizing for Navigate and Customize, with saved panel sizes after refresh
- Drawer open/closed state now persists across refreshes
- Removed the optional chatbar overlay; integrated chat management (select, new, rename, delete) into the bottom bar
- Added persona quick-access bubble next to the chat input with popup picker and automatic selected-persona highlighting
- Added a dedicated persona-list scroll area so the persona editor stays reachable
- Added bottom bar size slider (replaces the desktop top bar size slider)
- Rebalanced desktop, lower-resolution desktop, and mobile spacing so shell menus, World Info, prompt editors, and bottom-bar controls flex more consistently
- Aligned flat and bubble chat layouts so User and Assistant labels sit cleanly

**Home, Launchpad, and starter pack**

- Home screen defaults to First Steps with the Launchpad collapsed until opened
- Renamed "Replay Tutorial" to "Open Launchpad"
- Added "Chat with Assistant Nahida" button on the home screen alongside "Open Assistant"
- Assistant Nahida is now created at app startup so she appears in the character list by default
- Starter pack split into "Pre-installed" and "Optional installs" sections with clearer wording
- Added Summary Sharder and Guided Generations (forked) to the optional installs in the starter pack
- Bundled Memory Sharding Quick Reply preset for chat summarisation
- Updated the Geechan starter-pack card to credit Assistant Nahida and Prose Polisher
- Replaced the README screenshots with fresh Navigate, Customize, Agents, and Characters screenshots for desktop, mobile, and Moonlit Echoes

**Agents**

- Removed Agent Mode orchestration (retrieval/memory/lorebook services) to match the "intentionally lightweight" philosophy
- Removed the extra In-Chat Agents drawer so the Agents page opens directly into the standalone agent interface
- Recommended Summary Sharder extension as the memory solution in the starter pack
- Curated the bundled agent list down to Tracker, Randomizer, Content, and Custom categories
- Moved Direction Menu and CYOA Choices into Tracker and made generated choices clickable into the message box
- Bundled Geechan's Prose Polisher as a default post-generation "Rewrite current message" agent
- Credited bundled agents to Purachina, with Prose Polisher credited to Geechan
- Added running-agent toast notifications and clearer manual robot-button wording
- Fixed disabled agent buttons still being selectable
- Fixed Default/main connection profile handling for agents, including separate profile runs and 8192 default max tokens
- Fixed agents silently failing on edited or user-supplied text that was not freshly generated by the AI
- Agent cards now open in the editor when clicked, not only through the pencil icon
- Added fullscreen buttons to text editors

**Connection and extension fixes**

- Fixed stop generation button: `onStopStreaming()` now properly sets `isStopped` flag to prevent generation from appearing to complete normally
- Fixed story branching performance: replaced deep `structuredClone` of entire chat with shallow copy, only deep-cloning the target message when swipe selection requires it
- Fixed `applyBundledOptInDefaults()` always returning true (`return true || changed` → `return changed`)
- Fixed CLIENT_VERSION format: removed `v` prefix so `versionCompare()` works correctly with extensions that specify `minimum_client_version`
- Fixed circular dependency TDZ errors in GuidedGenerations, TunnelVision, Quick Reply, and TTS extensions
- Fixed OpenRouter connection state being forgotten after page reload
- Fixed TunnelVision settings not saving and lorebook search failing
- Fixed extension drawer state and extension enable/disable persistence across refreshes
- Aligned the Extensions panel update-notification checkbox and label
- Fixed duplicate TTS settings panel by adding init guard
- Fixed shell search results showing generic "Extensions" label instead of actual extension/section names
- Fixed persona search duplicate results
- Fixed the greeting/first message edit button
- Fixed double-clicking message action dots selecting the Home button
- Added custom OpenAI-compatible model-name auto-detection for matching provider icons
- Fixed current chat not auto-selecting in chat pickers
- Fixed prompt alignment for prompts that can and cannot be sent to in-chat agents
- Added single-dropdown-at-a-time enforcement via `closeAllDropdowns()`

**Platform support**

- Added Node.js fallback launcher: `start-node.sh`, `Start-Node.bat`, `npm run start:node`
- Auto-detect macOS and ARM platforms and switch to Node.js to avoid Bun CPU overhead (oven-sh/bun#26415)
- `SILLYBUNNY_USE_NODE=1` environment variable forces Node.js on any platform

### v1.3.1 (2026-04-12)

**In-Chat Agents**

- Fixed the broken agent-card interactions and restored reliable backend-backed Agent Group behavior
- Added ST-style regex script support for agents, including bundled regex packs for tracker and formatting templates
- Added prompt-transform passes with `rewrite` and `append` modes, optional alternate connection profiles, and automatic message refresh after mutation
- Bundled trackers now default to pre-generation, while bundled non-tracker regex-backed helpers default to post-generation behavior
- Greeting messages are now left untouched by all prompt-transform agents
- Added global and per-agent toast notifications for prompt-transform runs, enabled by default
- Added inline run-order editing on agent cards with clearer `lower first` ordering semantics
- Removed the duplicate bundled `Director Core` case and added bundled-template migration helpers for saved agents
- Split Pura's Director Preset into **SillyBunny** and **SillyTavern** variants

**Starter pack and bundled extras**

- Starter-pack extension cards now install **Character Colors** and **Image Gen** directly from GitHub instead of shipping their files inside the repo
- Updated the preset starter card to explain the two Director Preset variants more clearly

**UI/UX fixes**

- Moved the Agent Mode status overview inside the Agent Mode drawer so the Agents page reads more cleanly
- Improved narrow-width behavior for agent cards, toggles, and inline controls
- Refined the welcome-screen starter-pack presentation and preset actions

### v1.3.0

**In-Chat Agents (Beta)**

- Added the first release of In-Chat Agents on the Agents page
- Shipped 31 pre-made templates derived from Pura's Director Preset v12
- Added built-in Agent Groups plus one-click Prompt Manager transfer and JSON import/export
- Added connection-profile support for the `Refine with AI` flow

**UI/UX fixes**

- Agent Mode and In-Chat Agents became collapsible drawers on the Agents page
- Settings drawer state persistence was fixed
- Advanced Formatting now hides Instruct Template in Chat Completions mode
- Search labels, preset drawer styling, avatar centering, and narrow-card overflow all received cleanup
- Bundled third-party extensions were git-ignored to reduce local git churn

### v1.2.9

- Text Completion and Advanced Formatting settings moved to collapsible drawer sections
- Added OpenAI Responses API support
- Added auto-stash before git pull
- Added encrypted secrets at rest plus improved auth options

### v1.2.8

- CSS optimization pass, prompt drawer styling cleanup, adaptive contrast text variables
- Group-chat recovery fixes for stale or missing `.jsonl` references
- Version-label, palette-reset, mobile toggle, and border-radius token fixes

### v1.2.7

- Reworked Chat Completion drawers
- Added top-bar customization and Console Logs tab
- Improved character flow, settings UX, and Termux support

### v1.2.5

- Switched default port to `4444`
- Added cache clearing and message screenshot export
- Fixed Claude token counting on Bun and improved startup reliability

---

## Upstream Information

SillyBunny is a fork of SillyTavern. Most SillyTavern behavior, data formats, and ecosystem knowledge still apply. If running into an issue reproducable in upstream, please direct issues there.

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

## License

AGPL-3.0
