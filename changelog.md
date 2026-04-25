# Changelog

## Unreleased

Date: 2026-04-25

### Launcher And Dependencies
- Added a dependency-state marker so Windows and shell launchers skip routine installs when `package.json`, lockfiles, runtime profile, and `NODE_ENV` have not changed.
- Reduced Bun launcher install noise by using quiet install flags and kept Node launcher parity with `npm ci` when a lockfile is present.
- Preserved existing development dependency trees during launcher installs so ESLint keeps its compatible AJV dependency after future Bun or Node launcher runs.

### Tooling
- Added `scripts/**/*.js` to the standard lint targets and fixed existing lint errors so `npm run lint -- --quiet` passes again.

### Optional Moonlit Echoes
- Made extension-owned chat styles fall back to the default flat chat class when Moonlit Echoes is disabled or uninstalled, while preserving the saved style value for when the extension is re-enabled.
- Removed Moonlit-specific core search copy and avoided hard-coding the Moonlit drawer in Nemo's extension category list.
- Kept optional theme compatibility styles generic so the default UI remains presentable without Moonlit.
- Tightened the default chat, chat-management, and composer surfaces so transparent Moonlit-style chat tint values no longer make the core chat pane noisy or hard to read.
- Fixed Moonlit Echoes' enabled-theme chat avatar sizing inside the vendored extension so message thumbnails stay clipped to their configured frame on desktop and mobile.
- Added SB-owned Echo, Whisper, Hush, Ripple, and Tide chat styles so these layouts work without Moonlit Echoes installed or enabled, while Moonlit can still override its own custom variables when active.

### Group Chats
- Kept unread DM avatar pulsing in the group bottom bar from changing avatar alignment on desktop or mobile.
- Made unread avatar taps inside an existing group DM switch to that character's DM instead of inviting them into the current DM.
- Saved Character Author's Note (Private) to group chat metadata so the note persists on the actual group chat across speaker turns.

### Chat Management
- Added LLM-assisted chat labeling from the Chat History popup, with options to rename the current chat or batch-label timestamp-named chats while preserving chat contents.
- Added old-chat cleanup controls for age, time unit, newest-chat retention, dated-name-only filtering, preview, confirmation, cancellation, and current-chat protection.
- Added chat-backup cleanup controls inside the Chat History Backups drawer, including age/unit filters, newest-backup retention, preview, confirmation, and mobile-aligned controls.
- Reworked the Chat History popup controls so the new labeling and cleanup tools align cleanly on desktop and mobile, including full-width mobile search and balanced checkbox/text spacing.

### Mobile UI
- Renamed the top-bar Navigate button and matching onboarding/docs copy to Workspace so the shell label matches the panel title.
- Fixed the mobile Extensions header controls so the section title, update checkbox, and action buttons keep compact, centered alignment without relying on extension CSS.
- Restored zoomed chat avatars on desktop and mobile by accepting both thumbnail URLs and full avatar image paths when opening a message avatar.
- Aligned chat avatar metadata, swipe controls, and icon-only buttons so the default UI keeps strict square control sizing on desktop and mobile.
- Contained chat character thumbnails inside their avatar frames across the default UI, built-in chat styles, and the vendored Moonlit Echoes fork so oversized source images no longer spill into message content on desktop or mobile.
- Restored Individual recent chats by balancing the recent-chat fetch across individual and group conversations, and made Recent Chats filters manage their own collapsed, empty, and show-more states on desktop and mobile.
- Improved the default mobile chat composer so the textarea keeps a full-width row with square controls, and made default mobile header/composer surfaces more opaque to stop chat text from bleeding through.
- Added a persistent compact mode that reduces shell, top-bar, mobile tools, and mobile composer density while preserving checkbox and text alignment.
- Tightened default-theme settings, drawer, prompt manager, extension, and import surfaces so controls have consistent spacing, fixed icon sizing, theme-aware button text, and more bottom breathing room on desktop and mobile.
- Locked the agent-changes message icon to a square control and realigned the mobile prompt manager editor rows, labels, checkbox, and footer actions.
- Normalized icon-only buttons, drawer headers, recent-chat rows, prompt manager controls, World Info toolbars, background controls, and extension toolbars so mobile and desktop alignment stays centered, symmetrical, and square where expected.
- Made primary and highlighted accent button labels choose a contrast-aware theme color so pale highlights remain readable on desktop and mobile.
- Gave compact settings section headers consistent horizontal padding so titles no longer hug rounded panel edges.
- Aligned Chat Completion prompt/template preset selectors with their action buttons so the select field and icon controls share the same centered height on desktop and mobile.
- Normalized context-size quick buttons, added common 4K through 2M presets, aligned the Chat Completion token-budget slider row, and attached the same clickable presets directly to Text Completions context sizing.
- Normalized Chat Completion sampling number fields so range counters and standalone numeric inputs use equal, centered widths and heights instead of stretching into long thin boxes.
- Reworked Advanced Definitions into a left-aligned editor layout with less top padding, full-width sections, roomier resizable textareas, and a cleaner Character's Note control grid.
- Aligned group rows with character rows in the character list so avatars, titles, descriptions, counters, and secondary metadata share the same columns in list view.
- Removed deprecated wording from visible Extras source labels while keeping the underlying Extras compatibility options available.
- Normalized native and Select2 dropdown heights, radii, arrow spacing, and Chat Translation field layout so selects align evenly on desktop and mobile.
- Equalized User Settings drawer headers so top-level rows use the same centered title lane, height, and font size.
- Balanced the Prompt Manager list and editor into equal-width panes with roomier prompt row spacing so prompts no longer look squeezed against the panel edge.
- Made the World Info editor shrink safely inside desktop drawers and added a desktop-only resizable pop-up editor for roomier lorebook editing while mobile keeps its inline entry workflow.
- Shortened the primary character edit shortcut labels to `FAV.` and `ADV.` so they stay centered and readable in compact layouts.
- Made the character First Message editor taller by default on desktop and vertically resizable so long greetings are easier to edit without opening the maximized editor.
- Centered the Top Bar Label option cards so Context Size, Character Name, and Custom Text align cleanly inside their controls on desktop and mobile.
- Anchored the Sampling documentation help button inside the Sampling drawer header for chat and text completion presets so it no longer floats while scrolling.

### Server Tools
- Added thumbnail quality controls to Customize > Server for toggling thumbnail generation, choosing JPG or PNG, setting quality and dimensions, applying SillyBunny's recommended sharp-avatar preset, and clearing the current user's thumbnail cache for rebuilds without manually editing `config.yaml`.
- Made SillyBunny's sharp thumbnail preset the default: PNG thumbnails, quality 100, 240x135 backgrounds, and 864x1280 avatar/persona thumbnails.
- Equalized the Thumbnail Quality control grid so format, quality, dimension fields, and cache action buttons align symmetrically on desktop and mobile.

### Extensions
- Hardened the shared extension settings columns so duplicate top-level drawers for the same extension are removed automatically, including stale Quick Reply drawers after repeated activation.
- Fixed enabled In-Chat post-processing agents so automatic append, extract, and prompt-transform passes wait until the main generation is fully idle before applying.
- Made the In-Chat Agents separation checkbox actually scope enabled agents between Individual and Group chats, with UI toggles, bulk actions, tool registration, and Pathfinder enablement following the active chat type.
- Left-aligned Pathfinder diagnostics actions and fixed the Run Diagnostics button so its label determines the button width instead of being clipped as an icon-only control.
- Kept Pathfinder's Retrieval Log detail label and dropdown on one line with a dedicated, non-checkbox control layout.
- Hid Cancel Agent during ordinary chat generation and queued manual In-Chat Agent runs so multiple Apply actions run one at a time instead of being rejected.

Commits:
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
