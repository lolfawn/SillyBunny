# Mobile UX Improvements

SillyBunny includes specific fixes for mobile browsers and narrow viewports (under 768px–1000px). These address common pain points that make SillyTavern unusable on phones.

---

## Tab Scroll Indicators

On mobile, the Navigate and Customize shell tabs can be wider than the screen. SillyBunny adds:

- **Gradient scroll indicators** that fade in on the left or right edge when there are hidden tabs
- **Momentum scrolling** (`-webkit-overflow-scrolling: touch`) for smooth tab dragging
- **No text truncation** — tab labels stay on a single line with natural sizing instead of being clipped with ellipsis
- **48px minimum touch targets** for each tab button

The indicators automatically appear and disappear as you scroll through the tab bar.

---

## Modal and Popup Scrolling

On screens under 1000px wide, SillyBunny ensures that Settings, Extensions, and other popup dialogs scroll properly:

- `.popup-content` gets `overflow-y: auto` so content doesn't overflow the viewport
- `.popup-body` has a `max-height` of `95dvh` to keep the popup within the screen
- Pathfinder settings panels scroll independently on mobile

Without these fixes, popup dialogs on mobile would be cut off with no way to reach the bottom content or action buttons.

---

## Touch-Friendly Targets

All interactive elements in the shell navigation have minimum 48px height for comfortable touch interaction, aligning with mobile accessibility guidelines.

---

## CSS Breakpoints

| Breakpoint | Target |
|-----------|--------|
| `max-width: 1000px` | Tablet/phone — modals get scroll constraints |
| `max-width: 768px` | Phone — tab layout switches to compact mode |
| `max-width: 600px` | Small phone — Pathfinder settings get scroll constraints |

---

## Technical Details

The mobile fixes are in three files:

- **`public/css/sillybunny-tabs.css`** — Tab scroll indicators, momentum scrolling, touch targets
- **`public/css/mobile-styles.css`** — Popup body/content overflow rules
- **`public/css/popup.css`** — Popup content scrolling at 1000px breakpoint
- **`public/scripts/sillybunny-tabs.js`** — `updateNavScrollIndicators()` with scroll and resize event listeners

The scroll indicators use CSS pseudo-elements (`::before` and `::after`) with gradient overlays that respond to `.sb-can-scroll-left` and `.sb-can-scroll-right` CSS classes toggled by JavaScript.