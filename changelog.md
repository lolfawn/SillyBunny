# Changelog

## Unreleased

- Updated the launchpad quick-access and guide cards so Characters Menu, Global Search, and Import Character shortcuts now trigger the real panels/actions instead of dead placeholders.
- Simplified the launchpad bundled extras cards by merging purachina's site link into the Director Presets card, renaming the preset action to `Apply preset`, and adding a matching `Apply preset` action to the Geechan card.
- Removed stale launchpad wording around sample characters, reduced one remaining legacy settings-search dependency in `sillybunny-tabs.js`, and tightened hero centering on mobile so the bar beneath the mascot stays visually centered.
- Fixed Android/Termux IME autocomplete so replacements no longer append extra words while typing in the main send box.
- Fixed self-hosted Figtree fallback behavior on iOS/Safari and restored stronger default weights so the app no longer falls back to Noto Sans.
- Flattened AI Studio debug payload logging so complex request summaries print readably instead of collapsing into `[Object ...]`.
- Added a Google Font picker with preset and custom font support, plus persistent application through power-user settings.
- Reworked Customize > Settings drawer structure and spacing, including centered `Custom CSS` and `Google Font` headers and less cramped appearance rows.
- Fixed the welcome/home panel to auto-open on fresh installs, avoid duplicate insertion, remove the stale legacy template, and keep home mode controls visible in full, compact, and list-only layouts.
- Synced shared resizing behavior between the Navigate and Customize side panels.
