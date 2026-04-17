# SillyTavern Extension Compatibility

SillyBunny is a fork of SillyTavern, but uses a different version numbering scheme. This creates a compatibility issue: many SillyTavern extensions check the client version and refuse to install or run on versions they consider "too old."

---

## The Problem

SillyTavern is at version 1.13.x. SillyBunny is at 1.3.x. Semantically, 1.3 < 1.13, so when an extension checks `minimum_client_version: "1.13.2"`, it rejects SillyBunny as too old — even though SillyBunny contains all the APIs the extension needs.

The version comparison uses `localeCompare` with `{ numeric: true }`, which correctly handles `1.14.0 > 1.13.2` but fails when the `v` prefix is present (`"v1.3.6".localeCompare("1.13.2")` produces incorrect results).

---

## The Fix

SillyBunny applies a **version spoof** so that SillyTavern extensions see a compatible version:

1. **`v` prefix removal**: The `versionCompare()` function in `utils.js` now strips leading `v` or `V` prefixes from both the source and minimum version strings before comparison. This means `v1.3.6` and `1.3.6` are treated identically.

2. **Compat mapping**: SillyBunny 1.3.7 reports itself as compatible with ST 1.14.0. The `versionCompare()` function maps `1.3.7 → 1.14.0` during comparison, so any extension requiring `1.13.x` or earlier will pass the version check.

This happens transparently — extensions install and run without any manual intervention.

---

## How Extensions Load

The extension loading flow is:

1. Extension manifest specifies `minimum_client_version` (e.g., `"1.13.2"`)
2. SillyBunny's extension loader calls `versionCompare(clientVersion, minimum_client_version)`
3. `versionCompare` strips `v` prefixes, applies the compat mapping, and uses `localeCompare({ numeric: true })`
4. If the comparison passes, the extension loads normally

---

## For Extension Developers

If you're writing a SillyTavern extension and want it to work on SillyBunny:

- Don't use `v` prefixes in `minimum_client_version` — use plain numbers like `1.13.2`
- Test your extension on both SillyTavern and SillyBunny if possible
- SillyBunny's API surface is a superset of SillyTavern's — any extension that works on ST 1.13.x should work on SillyBunny 1.3.7+

---

## Technical Details

The relevant code:

- **`public/scripts/utils.js`** — `versionCompare()` function with `v` prefix stripping and `1.3.7 → 1.14.0` compat mapping
- **`public/scripts/extensions.js`** — `clientVersion` extraction strips `v` prefix before comparison
- **`public/script.js`** — `CLIENT_VERSION = 'SillyBunny:v1.3.7:platberlitz'` (original format preserved; spoofing happens at comparison time)