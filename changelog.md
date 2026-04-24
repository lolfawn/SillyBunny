# Changelog

## v1.4.3

Date: 2026-04-24

Changes:
- Added a bundled Chat Completions preset: `Geechan's Chatroom Prompt`.
- Added Recent Chats tabs for All, Individual, and Group chats so group conversations are easier to find.
- Added group bottom-bar controls for selecting the next speaker, persistent manual DM mode, Auto DM, and opening separate per-character DM chat files.
- Added private DM badges and prompt filtering so DMs stay hidden from unrelated group characters.
- Added group Auto Mode quality-of-life behavior: enabled automatically for group chats, 30-second default delay with an explicit seconds label, immediate all-member replies for “everyone/all/you all/y’all/everybody,” and direct name-call replies with a three-message anti-loop cap.
- Fixed stale DM targets, Auto DM being limited to one selected character, Auto Mode turning itself off while switching/typing, and group members replying multiple times when Auto Mode should control autonomous turns.
- Improved group UI alignment by lining up member rows and model override controls, and removed redundant Narrate Turn, Narrator Merge, and One at a time controls.

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
