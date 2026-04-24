# Changelog

## v1.4.5

Date: 2026-04-24

### Group Chats
- Reworked group chats around controllable speaker selection, Auto Mode, Auto DM, private per-character DM chats, unread DM badges, and a visible `{{char}} is typing...` indicator.
- Added context-aware group replies for direct name calls and group-wide prompts, with anti-loop limits for autonomous character-to-character replies.
- Added group schedules with generation toasts, time awareness, downtime catch-up, optional auto-messaging, and separate Auto DM cooldowns.
- Made group DMs private by default, participant-limited in context, one-tap from unread avatar badges, and easier to return from with `Return to Group`.
- Improved mobile group controls with compact buttons, stable typing text, evenly spaced avatars, clearer toggle states, and less visual flicker.

### Authors Notes
- Made Character Author's Note (Private) editable in group chats and separated group-specific notes from individual character-card notes.
- Fixed private note settings so `Use character author's note` and `Replace/Top/Bottom` persist and inject correctly.

### Added
- Added bundled Chat Completions presets for `Geechan - Universal Roleplay (Chat Completions) (v5.0)` and `Geechan's Chatroom Prompt`, with `Geechan's Chatroom Prompt` defaulting to a 256k context window.
- Added In-Chat Agents master enable/disable controls, agent chat separation options, and a Pathfinder memory summary UI with editable text and injection status.

### Fixed
- Fixed group chat saving and Recent Chats registration for new, named, and branched group chats.
- Fixed Auto Mode persistence per user, Auto Mode draft preservation, Auto DM routing into DM chats, and rapid-fire DM auto-replies.
- Fixed mobile bottom chat controls, stop/send button sizing, Agents Quick Toggles overflow, and frontend cache clearing after updater reloads.
- Removed redundant group modes and controls, including Narrator Merge, One at a time, and the old Narrate Turn flow.
- Updated `Geechan's Chatroom Prompt` emoji guidance to use normal emojis.
- Bumped app-owned version strings to `1.4.5` without changing dependency versions.

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
