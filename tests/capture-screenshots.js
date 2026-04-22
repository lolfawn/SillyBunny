#!/usr/bin/env node

/**
 * SillyBunny Screenshot Capture Script
 *
 * Automates screenshot capture for desktop and mobile viewports.
 * Requires the SillyBunny server to be running on port 4444.
 *
 * Usage:
 *   node tests/capture-screenshots.js --version=1.4.0
 *   node tests/capture-screenshots.js --version=1.5.0 --desktop-only
 *   node tests/capture-screenshots.js --version=1.5.0 --mobile-only
 */

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const versionArg = args.find(arg => arg.startsWith('--version='));
const desktopOnly = args.includes('--desktop-only');
const mobileOnly = args.includes('--mobile-only');

if (!versionArg) {
    console.error('Error: --version parameter is required');
    console.error('Usage: node tests/capture-screenshots.js --version=1.4.0');
    process.exit(1);
}

const version = versionArg.split('=')[1];
const baseURL = 'http://127.0.0.1:4444';
const screenshotsDir = join(__dirname, '..', 'screenshots');

// Viewport configurations
const viewports = {
    desktop: { width: 1920, height: 1080 },
    mobile: { width: 390, height: 844 }
};

// Screenshot sections configuration
const sections = [
    {
        name: 'navigate',
        description: 'AI Configuration drawer',
        setup: async (page) => {
            // Click AI Configuration icon
            await page.click('#leftNavDrawerIcon');
            // Wait for drawer to open
            await page.waitForSelector('#left-nav-panel.openDrawer', { timeout: 5000 });
            // Wait for content to render
            await page.waitForTimeout(500);
        }
    },
    {
        name: 'customize',
        description: 'User Settings drawer',
        setup: async (page) => {
            // Close any open drawers first
            const leftDrawerOpen = await page.locator('#left-nav-panel.openDrawer').isVisible().catch(() => false);
            if (leftDrawerOpen) {
                await page.click('#leftNavDrawerIcon');
                await page.waitForTimeout(300);
            }

            // Click User Settings button
            await page.click('#user-settings-button');
            // Wait for settings block to be visible
            await page.waitForSelector('#user-settings-block', { state: 'visible', timeout: 5000 });
            await page.waitForTimeout(500);
        }
    },
    {
        name: 'agents',
        description: 'In-Chat Agents (Pathfinder) settings',
        setup: async (page) => {
            // Close any open drawers
            const leftDrawerOpen = await page.locator('#left-nav-panel.openDrawer').isVisible().catch(() => false);
            if (leftDrawerOpen) {
                await page.click('#leftNavDrawerIcon');
                await page.waitForTimeout(300);
            }

            // Open Character Management to access characters
            await page.click('#rightNavDrawerIcon');
            await page.waitForSelector('#right-nav-panel.openDrawer', { timeout: 5000 });

            // Try to find and click a character (look for character tiles)
            const characterTile = page.locator('.character_select').first();
            const hasCharacter = await characterTile.isVisible().catch(() => false);

            if (hasCharacter) {
                await characterTile.click();
                await page.waitForTimeout(1000);

                // Close character drawer
                await page.click('#rightNavDrawerIcon');
                await page.waitForTimeout(300);

                // Look for Pathfinder/In-Chat Agents settings
                // This might be in extensions or a specific panel
                const pathfinderSettings = page.locator('#pf--settings, [data-extension="in-chat-agents"]').first();
                const hasPathfinder = await pathfinderSettings.isVisible().catch(() => false);

                if (hasPathfinder) {
                    await pathfinderSettings.scrollIntoViewIfNeeded();
                    await page.waitForTimeout(500);
                }
            }
        }
    },
    {
        name: 'characters',
        description: 'Character Management drawer',
        setup: async (page) => {
            // Close any open left drawers
            const leftDrawerOpen = await page.locator('#left-nav-panel.openDrawer').isVisible().catch(() => false);
            if (leftDrawerOpen) {
                await page.click('#leftNavDrawerIcon');
                await page.waitForTimeout(300);
            }

            // Click Character Management icon
            await page.click('#rightNavDrawerIcon');
            // Wait for drawer to open
            await page.waitForSelector('#right-nav-panel.openDrawer', { timeout: 5000 });
            // Ensure characters list is visible
            await page.click('#rm_button_characters').catch(() => {});
            await page.waitForTimeout(500);
        }
    },
    {
        name: 'in-chat',
        description: 'Active chat with Bunny Guide',
        setup: async (page) => {
            // Close all drawers
            const leftDrawerOpen = await page.locator('#left-nav-panel.openDrawer').isVisible().catch(() => false);
            if (leftDrawerOpen) {
                await page.click('#leftNavDrawerIcon');
                await page.waitForTimeout(300);
            }

            const rightDrawerOpen = await page.locator('#right-nav-panel.openDrawer').isVisible().catch(() => false);
            if (rightDrawerOpen) {
                await page.click('#rightNavDrawerIcon');
                await page.waitForTimeout(300);
            }

            // Wait for chat interface to be visible
            await page.waitForSelector('#chat', { state: 'visible', timeout: 5000 });
            await page.waitForTimeout(500);
        }
    }
];

async function captureScreenshots(viewportType) {
    const viewport = viewports[viewportType];
    console.log(`\n📸 Capturing ${viewportType} screenshots (${viewport.width}x${viewport.height})...`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    try {
        // Navigate to SillyBunny
        console.log(`   Navigating to ${baseURL}...`);
        await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 });

        // Wait for app to initialize
        await page.waitForTimeout(2000);

        // Capture each section
        for (const section of sections) {
            const filename = `sillybunny-ui-${viewportType}-${section.name}-v${version}.png`;
            const filepath = join(screenshotsDir, filename);

            console.log(`   Capturing ${section.description}...`);

            try {
                // Setup the UI for this screenshot
                await section.setup(page);

                // Take screenshot
                await page.screenshot({
                    path: filepath,
                    fullPage: false,
                    type: 'png'
                });

                console.log(`   ✓ Saved: ${filename}`);
            } catch (error) {
                console.error(`   ✗ Failed to capture ${section.name}: ${error.message}`);
            }
        }
    } catch (error) {
        console.error(`Error during ${viewportType} capture:`, error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

async function main() {
    console.log('🐰 SillyBunny Screenshot Capture Tool');
    console.log(`   Version: ${version}`);
    console.log(`   Output: ${screenshotsDir}`);

    // Check if server is running
    try {
        const response = await fetch(baseURL);
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }
    } catch (error) {
        console.error(`\n❌ Error: SillyBunny server is not running on ${baseURL}`);
        console.error('   Please start the server first: bun run start');
        process.exit(1);
    }

    try {
        if (!mobileOnly) {
            await captureScreenshots('desktop');
        }

        if (!desktopOnly) {
            await captureScreenshots('mobile');
        }

        console.log('\n✅ Screenshot capture complete!');
        console.log(`   Screenshots saved to: ${screenshotsDir}`);
    } catch (error) {
        console.error('\n❌ Screenshot capture failed:', error.message);
        process.exit(1);
    }
}

main();
