# SillyBunny Screenshot Guide

This guide explains how to manually capture screenshots for the README gallery, ensuring consistency across releases.

## Overview

Each release includes 10 screenshots:
- 5 desktop views (1920x1080)
- 5 mobile views (390x844)

Sections: **Navigate**, **Customize**, **Agents**, **Characters**, **In-Chat**

---

## Prerequisites

1. **Start the server**: `bun run start`
2. **Browser**: Chrome/Chromium recommended for consistency
3. **Clean state**: No error messages, loading spinners, or sensitive data visible

---

## Desktop Screenshots (1920x1080)

### Browser Setup

1. Open Chrome/Chromium
2. Navigate to `http://127.0.0.1:4444`
3. Press `F11` for fullscreen mode (or manually resize to 1920x1080)
4. Wait for the app to fully load

### Capture Each Section

#### 1. Navigate (AI Configuration)

- **What to show**: AI Configuration drawer with response settings
- **Steps**:
  1. Click the **AI Configuration** icon (sliders icon) at the top-left
  2. Wait for the `#left-nav-panel` drawer to slide open
  3. Ensure settings are visible and drawer animation is complete
  4. Take screenshot
- **Filename**: `sillybunny-ui-desktop-navigate-v{VERSION}.png`

#### 2. Customize (User Settings)

- **What to show**: User Settings drawer with appearance/theme options
- **Steps**:
  1. Close the AI Configuration drawer if open (click the icon again)
  2. Click the **User Settings** icon (gear/cog icon)
  3. Wait for the `#user-settings-block` to appear
  4. Ensure customization options are visible
  5. Take screenshot
- **Filename**: `sillybunny-ui-desktop-customize-v{VERSION}.png`

#### 3. Agents (In-Chat Agents)

- **What to show**: In-Chat Agents (Pathfinder) settings panel
- **Steps**:
  1. Close any open drawers
  2. Open Character Management (address card icon at top-right)
  3. Select a character to start a chat
  4. Close the Character Management drawer
  5. Look for In-Chat Agents or Pathfinder settings panel
  6. Ensure the agents interface is visible
  7. Take screenshot
- **Filename**: `sillybunny-ui-desktop-agents-v{VERSION}.png`

#### 4. Characters (Character Management)

- **What to show**: Character Management drawer with character list
- **Steps**:
  1. Close any open left drawers
  2. Click the **Character Management** icon (address card) at top-right
  3. Wait for the `#right-nav-panel` drawer to open
  4. Ensure character list is visible (click "Characters" tab if needed)
  5. Take screenshot
- **Filename**: `sillybunny-ui-desktop-characters-v{VERSION}.png`

#### 5. In-Chat (Bunny Guide Chat)

- **What to show**: Active conversation with Bunny Guide character
- **Steps**:
  1. Close all drawers
  2. Ensure a chat is active (preferably with Bunny Guide character)
  3. Ensure chat messages are visible
  4. Take screenshot showing the main chat interface
- **Filename**: `sillybunny-ui-desktop-in-chat-v{VERSION}.png`

### Taking the Screenshot

**Option 1: Browser DevTools**
1. Press `F12` to open DevTools
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "screenshot" and select "Capture screenshot"
4. Save to `/screenshots/` directory

**Option 2: OS Screenshot Tool**
- **Windows**: `Win+Shift+S` → select area
- **macOS**: `Cmd+Shift+4` → select area
- **Linux**: `Shift+PrtScn` or use Flameshot/Spectacle

---

## Mobile Screenshots (390x844)

### Browser Setup

1. Open Chrome/Chromium
2. Navigate to `http://127.0.0.1:4444`
3. Press `F12` to open DevTools
4. Click the **Toggle Device Toolbar** icon (or press `Ctrl+Shift+M`)
5. Select **iPhone 12 Pro** from the device dropdown (or set custom 390x844)
6. Ensure "Show device frame" is **disabled** for consistency

### Capture Each Section

Follow the same steps as desktop for each section:
1. **Navigate**: AI Configuration drawer
2. **Customize**: User Settings drawer
3. **Agents**: In-Chat Agents panel
4. **Characters**: Character Management drawer
5. **In-Chat**: Active chat view

**Note**: Mobile UI uses the same drawer system as desktop, just with responsive layout.

### Taking the Screenshot

1. With DevTools open and device mode active
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "screenshot" and select "Capture screenshot"
4. This captures only the viewport (not the device frame)
5. Save to `/screenshots/` directory

**Filenames**: `sillybunny-ui-mobile-{section}-v{VERSION}.png`

---

## Screenshot Optimization

After capturing all screenshots, optimize file sizes:

### Using pngquant

```bash
# Install pngquant (if not already installed)
# Ubuntu/Debian: sudo apt install pngquant
# macOS: brew install pngquant
# Windows: download from https://pngquant.org/

# Optimize all screenshots
cd screenshots
pngquant --quality=65-80 *.png --ext .png --force
```

### Target File Sizes

- **Desktop**: 150-350 KB per screenshot
- **Mobile**: 60-120 KB per screenshot

If files are too large, increase compression:
```bash
pngquant --quality=60-75 *.png --ext .png --force
```

---

## Checklist

Before committing screenshots:

- [ ] All 10 screenshots captured (5 desktop + 5 mobile)
- [ ] Filenames follow convention: `sillybunny-ui-{desktop|mobile}-{section}-v{VERSION}.png`
- [ ] No sensitive data visible (API keys, personal info)
- [ ] No error messages or loading spinners
- [ ] Consistent theme across all screenshots
- [ ] File sizes are reasonable (not multi-MB)
- [ ] Screenshots saved to `/screenshots/` directory

---

## After Capturing

1. **Update README** (if version changed):
   ```bash
   # Edit README.md to reference new version in image URLs
   # Example: v1.4.0 → v1.5.0
   ```

2. **Sync mirror README**:
   ```bash
   bash scripts/sync-readme-mirror.sh
   ```

3. **Commit screenshots**:
   ```bash
   git add screenshots/sillybunny-ui-*-v{VERSION}.png
   git commit -m "docs: add v{VERSION} screenshots"
   ```

---

## Troubleshooting

### Drawer won't open
- Refresh the page and try again
- Check browser console for errors
- Ensure server is running properly

### Screenshot is blank/black
- Wait longer for animations to complete
- Try disabling hardware acceleration in browser
- Use a different screenshot method

### File sizes too large
- Use pngquant with lower quality settings
- Ensure you're capturing viewport only (not full page)
- Check for unnecessary transparency channels

### Mobile view looks wrong
- Verify viewport is exactly 390x844
- Disable device frame in DevTools
- Refresh page after changing viewport size

---

## Automated Alternative

For faster screenshot generation, use the Playwright automation script:

```bash
# Start server first
bun run start

# In another terminal, run the script
node tests/capture-screenshots.js --version=1.5.0

# Desktop only
node tests/capture-screenshots.js --version=1.5.0 --desktop-only

# Mobile only
node tests/capture-screenshots.js --version=1.5.0 --mobile-only
```

The script handles all navigation and timing automatically.