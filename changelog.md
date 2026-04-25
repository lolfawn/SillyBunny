# Changelog

## Unreleased

Date: 2026-04-26

### Added
- Added built-in Echo, Whisper, Hush, Ripple, and Tide chat styles plus a persistent compact mode so the core UI no longer depends on Moonlit Echoes.
- Added Chat History tools for LLM-assisted chat labels, old-chat cleanup, and backup cleanup with previews, confirmations, retention filters, and mobile-friendly controls.
- Added Customize > Server thumbnail controls for format, quality, dimensions, sharp defaults, and per-user cache clearing; sharp PNG thumbnails are now the default.
- Added roomier editing tools, including a resizable first-message field, a desktop World Info pop-up editor, expanded context-size presets, and Text Completions preset parity.

### Changed
- Reworked the default desktop and mobile UI for more consistent spacing, square icon buttons, aligned drawers, normalized dropdowns, readable highlighted text, and a less cramped composer.
- Made Moonlit Echoes optional by removing core UI assumptions about its drawers, search copy, and chat-style ownership while keeping compatibility when the extension is enabled.
- Renamed Navigate to Workspace, shortened the primary character shortcut labels to `FAV.` and `ADV.`, and removed deprecated visible Extras wording.
- Cleaned up launcher installs so routine starts are quieter, preserve ESLint dependencies, and avoid unnecessary dependency work when runtime inputs have not changed.

### Fixed
- Fixed chat and character UI regressions around zoomed avatars, overflowing thumbnails, individual recent chats, group-row alignment, prompt visibility eye buttons, WebKit Ripple rendering, bottom chat spacing, and composer panel theming.
- Fixed group chat edge cases so unread DM avatars stay aligned, DM taps open the correct private chat, and Character Author's Note (Private) persists on the group chat.
- Fixed In-Chat Agent behavior for separated Individual/Group enablement, queued manual runs, hidden idle cancel buttons, Pathfinder control alignment, and automatic post-generation runs on desktop and mobile.
- Fixed duplicate extension settings drawers so repeated extension activation does not create doubled panels.
- Fixed Moonlit Echoes fork styling so enabled Moonlit chat thumbnails and the mobile composer remain usable.
- Fixed lint coverage by including `scripts/**/*.js` in the standard ESLint target and resolving the existing lint failures.

### Commits
- `fix(ui): make Moonlit Echoes optional`
- `fix(tooling): keep eslint stable after launcher installs`
- `fix(ui): improve default chat surface readability`
- `fix(ui): restore zoomed chat avatars`
- `fix(ui): align chat icon controls`
- `fix(ui): restore individual recent chats`
- `fix(extension): contain moonlit chat avatars`
- `feat(server): add thumbnail quality controls`
- `fix(extension): prevent duplicate settings drawers`
- `fix(ui): improve mobile composer readability`
- `feat(ui): add built-in chat styles and compact mode`
- `fix(ui): stabilize group DM avatar actions`
- `fix(ui): polish default theme alignment`
- `fix(ui): align mobile prompt controls`
- `fix(ui): normalize responsive alignment`
- `fix(group): persist private author notes in group chats`
- `fix(agents): apply post-processing after generation`
- `fix(ui): contain chat thumbnails`
- `fix(server): sharpen default thumbnails`
- `fix(ui): equalize thumbnail settings layout`
- `fix(ui): improve highlighted button contrast`
- `fix(ui): pad settings section headers`
- `fix(ui): remove deprecated extras labels`
- `fix(ui): normalize dropdown sizing`
- `fix(ui): equalize settings drawer headers`
- `fix(ui): balance prompt manager panes`
- `fix(ui): add world info editor popout`
- `fix(ui): shorten character shortcut labels`
- `fix(ui): allow resizing first message editor`
- `fix(ui): center top bar label options`
- `fix(ui): anchor sampling docs link`
- `fix(agents): separate enabled agents by chat type`
- `fix(ui): align pathfinder diagnostics button`
- `fix(ui): keep pathfinder log detail inline`
- `fix(agents): queue manual agent runs`
- `fix(ui): rename navigate button to workspace`
- `fix(ui): align prompt preset controls`
- `fix(ui): normalize context size presets`
- `fix(ui): normalize sampling number fields`
- `fix(ui): improve advanced definitions editing`
- `fix(ui): align group character list rows`
- `feat(chat): add auto-label and cleanup tools`
- `feat(chat): add backup cleanup controls`
- `fix(ui): stabilize persona and ripple mobile layout`
- `fix(ui): tighten chat bottom spacing`
- `fix(extension): prevent moonlit mobile composer stretching`
- `fix(ui): keep mobile stop button aligned`
- `fix(agents): run automatic post agents on mobile`
- `fix(ui): show one message visibility icon`
- `docs(changelog): condense unreleased notes`
- `fix(ui): theme rounded chat composer`

## v1.4.5

Date: 2026-04-24

### Group Chats
- Added a full group-chat control bar with speaker selection, Speak Now, manual DM mode, Auto Mode, Auto DM, unread DM badges, and compact mobile controls.
- Added private per-character DM chats with participant-limited context, one-tap unread DM opening, forced DM mode inside DM chats, and Return to Group navigation.
- Added context-aware replies for direct name calls and group-wide prompts, plus anti-loop limits for autonomous character replies.
- Added AI-generated 24-hour schedules with time awareness, generation toasts, downtime catch-up, optional auto-messaging, and separate Auto DM cooldowns.
- Fixed group chat saving, branching, Recent Chats registration, empty new chats, custom-name reuse, Auto Mode persistence, draft preservation, and rapid-fire DM auto-replies.
- Removed redundant group modes and controls, including Narrator Merge, One at a time, and the old Narrate Turn flow.

### Character Notes
- Made Character Author's Note (Private) editable in group chats and separated group-specific notes from individual chat notes.
- Fixed private note persistence and injection for `Use character author's note` plus `Replace`, `Top`, and `Bottom` placement.

### UI And Mobile
- Fixed mobile bottom chat controls, send/stop sizing, group avatar spacing, typing indicator alignment, toggle visibility, unread DM badge visibility, and avatar refresh flicker.
- Fixed Agents Quick Toggles overflow and added clearer agent enable/disable and chat-separation controls.

### Presets And Maintenance
- Added bundled Chat Completions presets for `Geechan - Universal Roleplay (Chat Completions) (v5.0)` and `Geechan's Chatroom Prompt`, with `Geechan's Chatroom Prompt` defaulting to a 256k context window.
- Added a separate Pathfinder memory summary UI with editable summary text and injection status.
- Fixed frontend cache clearing after updater reloads.
- Updated `Geechan's Chatroom Prompt` emoji guidance to use normal emojis.
- Bumped app-owned version strings to `1.4.5` without changing dependency versions.

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
