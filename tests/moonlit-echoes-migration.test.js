import { describe, expect, test } from '@jest/globals';

import { migrateMoonlitEchoesSettings } from '../src/migrations/moonlit-echoes.js';

describe('Moonlit Echoes settings migration', () => {
    test('removes obsolete bundled disabled extension entries', () => {
        const settings = {
            extension_settings: {
                disabledExtensions: [
                    'SillyTavernMoonlitEchoesTheme',
                    'third-party/SillyTavernMoonlitEchoesTheme',
                    'third-party/SillyBunny-MoonlitEchoesTheme',
                    'third-party/OtherExtension',
                ],
                SillyTavernMoonlitEchoesTheme: {
                    enabled: true,
                    activePreset: 'Moonlit',
                },
            },
        };

        expect(migrateMoonlitEchoesSettings(settings)).toBe(true);
        expect(settings.extension_settings.disabledExtensions).toEqual([
            'third-party/SillyBunny-MoonlitEchoesTheme',
            'third-party/OtherExtension',
        ]);
    });

    test('preserves the shared fork settings key and enabled value', () => {
        const settings = {
            extension_settings: {
                disabledExtensions: ['SillyTavernMoonlitEchoesTheme'],
                SillyTavernMoonlitEchoesTheme: {
                    enabled: true,
                    activePreset: 'Moonlit',
                },
            },
        };

        migrateMoonlitEchoesSettings(settings);

        expect(settings.extension_settings.SillyTavernMoonlitEchoesTheme).toEqual({
            enabled: true,
            activePreset: 'Moonlit',
        });
    });

    test('does not add migration state when no obsolete entries exist', () => {
        const settings = {
            extension_settings: {
                disabledExtensions: ['third-party/SillyBunny-MoonlitEchoesTheme'],
                SillyTavernMoonlitEchoesTheme: {
                    enabled: false,
                },
            },
        };

        expect(migrateMoonlitEchoesSettings(settings)).toBe(false);
        expect(settings.extension_settings.SillyTavernMoonlitEchoesTheme.enabled).toBe(false);
    });
});
