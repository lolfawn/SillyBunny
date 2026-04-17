# Shell Tabs

SillyBunny replaces SillyTavern's single-panel layout with a **tab shell** system that organizes features into two side-by-side navigation panels.

---

## What It Is

Instead of SillyTavern's drawer-and-extension-panel approach, SillyBunny uses two collapsible **shells**:

| Shell | Contains |
|-------|----------|
| **Navigate** (left) | Presets, API settings, World Info, character cards, In-Chat Agents |
| **Customize** (right) | General settings, Extensions, Persona, background, server config, console |

Each shell has its own **tab bar** that lets you switch between sections without closing the shell.

---

## Tab Navigation

### Desktop

Click any tab in the shell header to switch sections. The active tab is highlighted, and the panel below updates immediately.

### Mobile

On narrow screens (under 768px), tab labels are preserved rather than truncated. If the tab bar is wider than the screen:

- **Scroll indicators** appear as gradient overlays on the left and right edges of the tab bar
- Swipe or drag horizontally to reveal hidden tabs
- Tab text stays on a single line with no wrapping

The indicators fade in and out automatically based on whether there are hidden tabs in either direction.

---

## Keyboard and Touch

- Tabs respond to both click and touch
- On mobile, the tab bar scroll area has momentum scrolling (`-webkit-overflow-scrolling: touch`)
- Each tab has a minimum 48px touch target height for accessibility

---

## Custom Tab Configuration

Tabs are defined in `sillybunny-tabs.js` as `SB_SHELLS.LEFT` and `SB_SHELLS.RIGHT`. Each shell entry specifies:

```js
{
    id: 'agents',
    label: 'Agents',
    icon: 'fa-robot',
    content: () => buildAgentPanel(),
}
```

The shell system handles:

- Tab rendering and scrolling
- Panel content injection
- Active state management
- Tab activation events (`sb:shell-tab-activated`)
- Responsive breakpoint handling

---

## Integration Points

Other extensions can hook into the shell system:

- **`sb:shell-tab-activated`** event fires when a tab is selected. In-Chat Agents uses this to re-sync tool registrations when the Agents tab opens.
- **`SB_MOBILE_MEDIA_QUERY`** constant (`(max-width: 768px)`) for responsive checks.
- **`sbState.initialized`** flag prevents double-initialization on slow starts.

---

## Troubleshooting

**Tabs don't appear on first load (blank shell):**

This was a known race condition on slow VPS environments. As of v1.3.5, the shell system now has an `APP_READY` fallback that retries initialization if the DOMContentLoaded path didn't complete. If you still see this, try refreshing.

**Tab content is cut off on mobile:**

Settings, Extensions, and Pathfinder modals now have proper scrolling on mobile (viewports under 1000px). If a modal still appears cut off, check that the content panel doesn't have a fixed height override.