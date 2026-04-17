# SillyBunny Maintainer Notes

This file is the practical release and handoff checklist for maintainers and coding agents working in this repo.

## Release vs hotfix

- Treat a normal release and a hotfix differently.
- Normal release: bump the SillyBunny version references, update the README changelog and current-release copy, sync both README files, and prepare a Discord-friendly update post.
- Hotfix: do not do any of that. No version bump, no README pass, no changelog pass, and no Discord post. Just provide a short bulleted list of what was hotfixed.

## README rule

- `README.md` is the source of truth.
- `.github/readme.md` is a mirror used for the GitHub project homepage.
- Never hand-edit `.github/readme.md`.
- After any root README change, run:

```bash
bash scripts/sync-readme-mirror.sh
```

## Non-hotfix release checklist

1. Pick the new version and release date.
2. Bump the known SillyBunny version references:
   - `package.json` -> `"version"`
   - `public/script.js` -> `SILLYBUNNY_UI_VERSION`
   - `public/script.js` -> `CLIENT_VERSION`
   - `public/scripts/templates/welcome.html` -> the landing-page eyebrow text
   - `src/endpoints/horde.js` -> the fallback client agent string
3. Search for stale version strings and review the remaining hits.
4. Update `README.md`:
   - add the new changelog entry at the top of the changelog
   - update any "current release" copy that names the latest version
   - make sure the changelog is present in the root README before syncing the mirror
5. Sync `.github/readme.md` from the root README.
6. Confirm both README files now show the same latest changelog entry.
7. Prepare a Discord-friendly update post.

## Search helper

Replace `1.3.2` below with the previous version number when checking for stale references:

```bash
rg -n --glob '!node_modules/**' --glob '!public/lib/**' --glob '!dist/**' \
  '1\.3\.2|v1\.3\.2|SillyBunny:v1\.3\.2' .
```

Notes:

- Ignore dependency lockfile hits unless the project version itself is actually stored there.
- Do not rewrite older changelog entries just because they mention older versions.
- `src/util.js` builds the live server version object from `package.json`, so that part updates automatically once the package version is bumped. The Horde fallback in `src/endpoints/horde.js` is still manual.

## README expectations

- The changelog lives in `README.md`, and syncing the mirror carries it into `.github/readme.md`.
- If the README calls out the current release by version in sections like "What ships with...", "Bundled defaults in...", or the screenshot caption, keep those current when doing a normal release.
- Do not manually maintain two separate changelogs. Update the root README and sync the mirror.

## Discord-friendly release post

Keep it short, plain-English, and easy to scan. Lead with `@here` and the version, then a one-sentence summary, then fixes grouped by category with bold headers. End with update instructions.

Template:

```md
@here

**SillyBunny vX.Y.Z is up**

One-sentence summary of what this release delivers.

**Category name**

- Fixed …
- Added …

**Another category**

- Fixed …
- Restored …

**How to update**

- Built-in updater, **Customize → Server → Update**
- Git clone, `git pull`
- Launcher users, restart with `Start.bat` / `start.sh`
```

### Style guide

- Use `@here` at the top to ping the channel.
- Version line is **bold** with "is up" — not "released" or "available".
- The one-sentence summary after the version covers the main themes without listing everything.
- Group fixes under **bold category headers** that match functional areas (e.g., "Shell and startup", "Streaming and swipes", "In-Chat Agents / connection profiles", "Versioning and docs"). Group by subsystem, not by PR.
- Each bullet is a self-contained fix or addition — no "also fixed" chains.
- Start bullet with the verb: "Fixed", "Added", "Restored", "Bumped", "Removed".
- End with the **How to update** section showing all three update paths.
- No internal jargon, no code references, no ticket numbers — write for users.

## Hotfix summary format

For a hotfix, do not do the normal release workflow above. Just hand off a short bullet list:

```md
Hotfixed:
- ...
- ...
- ...
```
