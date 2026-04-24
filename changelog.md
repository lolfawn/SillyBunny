# Changelog

## v1.4.3

Date: 2026-04-24

### Group Chats
- Added Recent Chats tabs for All, Individual, and Group chats, and fixed empty/new group chats so they save, register, branch, and reappear correctly.
- Added bottom-bar group controls for choosing who speaks next/now, Auto Mode, Auto DM, manual DM mode, and separate per-character DM chat files.
- Added private DM badges, forced DM mode inside DM chats, a Return to Group button, and participant-only DM visibility so uninvited characters cannot read or reply to private DM context.
- Added context-aware group replies: direct name calls trigger the addressed character, group-wide phrases trigger all eligible speakers, and autonomous replies stop after a three-message anti-loop cap.
- Added AI-generated 24-hour schedules with generation toasts, system-time awareness, delayed catch-up behavior after downtime, and optional auto-messaging.
- Improved group chat defaults and mobile usability by keeping Auto Mode off by default, using a 120-second delay when enabled, starting new group chats empty, and compacting group speaker controls on small screens.
- Removed redundant group modes and controls, including Narrator Merge, One at a time, and the old Narrate Turn flow.

### Added
- Added bundled Chat Completions presets for `Geechan - Universal Roleplay (Chat Completions) (v5.0)` and `Geechan's Chatroom Prompt`, with `Geechan's Chatroom Prompt` defaulting to a 256k context window.
- Added an In-Chat Agents master on/off button and an option to separate Agent chats from normal Individual and Group Recent Chats.
- Added a separate UI for Pathfinder memory summaries, including editable summary text and injection status.

### Fixed
- Fixed the built-in updater so `Auto-clear cache after updates` clears frontend cache before the post-update reload.
- Fixed mobile overflow in the Agents Quick Toggles area.
- Fixed group chat creation with custom names/member sets so matching groups are reused and new chat branches are easier to return to.
- Fixed several group DM edge cases, including stale DM targets, Auto DM applying only to one selected character, and characters replying when Auto Mode was off.

## v1.4.2

Date: 2026-04-24

Changes:
- Fixed mobile shell icon regressions so top-bar buttons, bottom chat controls, mobile utility buttons, Navigate, Customize, Characters, and send controls keep square dimensions and centered icons on iOS Safari.
- Fixed Navigate to Customize shell switching so Customize remains open after cross-menu transitions instead of flashing and closing during the drawer animation handoff.
- Fixed high Page Width layouts by sizing the right-side Characters panel independently from chat width, preserving usable panel width and MovingUI compatibility.
- Improved enlarged chat/Ripple avatar quality by preferring the full avatar source for rendered message avatars instead of stretching small thumbnails.
- Added Claude-only Chat Completion preset toggles for disabling `temperature` and `top_p`; enabled toggles omit those fields from Anthropic Messages requests instead of sending numeric values.
- Improved Pathfinder Retrieval Log coverage for pipeline retrieval, legacy/tool retrieval, selected lorebooks, selected entries, stage results, injected prompt context, and tool activity.
- Restored untruncated DeepSeek request prompt debug logging where needed for final generation payload inspection while keeping normal payload summaries available elsewhere.
- Updated DeepSeek thinking-mode handling, including the new `deepseek-v4` option, safer `reasoning_content` cleanup for normal turns, continuation-only tool-call compatibility, and no `logprobs`/`top_logprobs` on thinking models.
- Aligned updater status and admin update pulls with the current tracking branch, such as `origin/staging`, instead of implying a hardcoded main-branch update path.
- Bumped app-owned version strings to `1.4.2` without changing dependency versions.

Commits:
- `fix(release): ship v1.4.2 provider and shell polish`

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
