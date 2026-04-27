import fs from 'node:fs';
import path from 'node:path';

import { sync as writeFileAtomicSync } from 'write-file-atomic';

import { SETTINGS_FILE } from '../constants.js';

const obsoleteBundledMoonlitExtensionNames = new Set([
    'SillyTavernMoonlitEchoesTheme',
    'third-party/SillyTavernMoonlitEchoesTheme',
]);

function getSettingsPath(userDirectories) {
    return path.join(userDirectories.root, SETTINGS_FILE);
}

export function migrateMoonlitEchoesSettings(settings) {
    const extensionSettings = settings?.extension_settings;
    if (!extensionSettings || typeof extensionSettings !== 'object' || !Array.isArray(extensionSettings.disabledExtensions)) {
        return false;
    }

    const disabledExtensions = extensionSettings.disabledExtensions;
    const nextDisabledExtensions = disabledExtensions.filter(name => !obsoleteBundledMoonlitExtensionNames.has(name));
    if (nextDisabledExtensions.length === disabledExtensions.length) {
        return false;
    }

    // SillyBunny: the fork intentionally reuses the legacy settings key, so do not change theme state here.
    extensionSettings.disabledExtensions = nextDisabledExtensions;
    return true;
}

function migrateMoonlitEchoesUserSettings(userDirectories) {
    const settingsPath = getSettingsPath(userDirectories);
    if (!fs.existsSync(settingsPath)) {
        return false;
    }

    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    if (!migrateMoonlitEchoesSettings(settings)) {
        return false;
    }

    writeFileAtomicSync(settingsPath, JSON.stringify(settings, null, 4), 'utf8');
    return true;
}

export function migrateMoonlitEchoesSettingsForUsers(userDirectoriesList) {
    let migratedCount = 0;

    for (const userDirectories of userDirectoriesList) {
        try {
            if (migrateMoonlitEchoesUserSettings(userDirectories)) {
                migratedCount++;
            }
        } catch (error) {
            console.warn(`[Moonlit Echoes] Failed to migrate settings in ${getSettingsPath(userDirectories)}.`, error);
        }
    }

    if (migratedCount > 0) {
        const suffix = migratedCount === 1 ? '' : 's';
        console.log(`[Moonlit Echoes] Cleaned obsolete bundled extension state in ${migratedCount} settings file${suffix}; fork settings were preserved.`);
    }
}
