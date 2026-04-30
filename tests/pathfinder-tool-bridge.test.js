import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

let mockSettings;

await jest.unstable_mockModule('../public/scripts/extensions/in-chat-agents/pathfinder/tree-store.js', () => ({
    getSettings: jest.fn(() => mockSettings),
    getTree: jest.fn(() => null),
    isLorebookEnabled: jest.fn(bookName => mockSettings.enabledLorebooks.includes(bookName)),
    canReadBook: jest.fn(() => true),
    canWriteBook: jest.fn(() => true),
}));

const { getActiveTunnelVisionBooks } = await import('../public/scripts/extensions/in-chat-agents/pathfinder/pathfinder-tool-bridge.js');

describe('Pathfinder lorebook source selection', () => {
    beforeEach(() => {
        mockSettings = {
            enabledLorebooks: ['Manual Book'],
            includeContextualLorebooks: true,
        };
        globalThis.window = {
            SillyTavern: {
                getContext: () => ({
                    chatMetadata: { world_info: 'Chat Book' },
                    powerUserSettings: { persona_description_lorebook: 'Persona Book' },
                    worldInfoSettings: {
                        charLore: [{ name: 'hero', extraBooks: ['Extra Book', 'Manual Book'] }],
                    },
                    characters: [{ avatar: 'hero.png', data: { extensions: { world: 'Primary Book' } } }],
                    characterId: 0,
                    groupId: null,
                    groups: [],
                }),
            },
        };
    });

    afterEach(() => {
        delete globalThis.window;
    });

    test('merges manual, chat, character, and persona lorebooks by default', () => {
        expect(getActiveTunnelVisionBooks()).toEqual([
            'Manual Book',
            'Chat Book',
            'Persona Book',
            'Primary Book',
            'Extra Book',
        ]);
    });

    test('can preserve manual-only behavior when contextual lorebooks are disabled', () => {
        mockSettings.includeContextualLorebooks = false;

        expect(getActiveTunnelVisionBooks()).toEqual(['Manual Book']);
    });
});
