/* global globalThis */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

const TOOL_NAMES = [
    'Pathfinder_Search',
    'Pathfinder_Summarize',
    'Pathfinder_Remember',
];

let mockSettings;
let mockTrees;
let mockActiveBooks;
let mockContextualBooks;
let mockEnabledAgents;
let mockRuntimeAgent;

await jest.unstable_mockModule('../public/scripts/extensions/in-chat-agents/pathfinder/tree-store.js', () => ({
    getSettings: jest.fn(() => mockSettings),
    getTree: jest.fn(bookName => mockTrees[bookName] ?? null),
    getAllEntryUids: jest.fn(tree => tree.uids ?? []),
}));

await jest.unstable_mockModule('../public/scripts/extensions/in-chat-agents/pathfinder/pathfinder-tool-bridge.js', () => ({
    ALL_TOOL_NAMES: TOOL_NAMES,
    getActiveTunnelVisionBooks: jest.fn(() => mockActiveBooks),
    getContextualLorebooks: jest.fn(() => mockContextualBooks),
}));

await jest.unstable_mockModule('../public/scripts/extensions/in-chat-agents/agent-store.js', () => ({
    getEnabledToolAgents: jest.fn(() => mockEnabledAgents),
}));

await jest.unstable_mockModule('../public/scripts/extensions/in-chat-agents/agent-runner.js', () => ({
    getPathfinderRuntimeAgent: jest.fn(() => mockRuntimeAgent),
}));

const { runDiagnostics } = await import('../public/scripts/extensions/in-chat-agents/pathfinder/diagnostics.js');

describe('Pathfinder diagnostics', () => {
    beforeEach(() => {
        mockSettings = {
            enabledLorebooks: ['Manual Book'],
            includeContextualLorebooks: true,
            pipelineEnabled: false,
            sidecarEnabled: true,
        };
        mockTrees = {
            'Manual Book': { uids: ['uid-1', 'uid-2'] },
        };
        mockActiveBooks = ['Manual Book'];
        mockContextualBooks = ['Chat Book'];
        mockEnabledAgents = [];
        mockRuntimeAgent = {
            tools: TOOL_NAMES.map(name => ({ name, enabled: true })),
        };
        globalThis.window = {
            SillyTavern: {
                getContext: () => ({
                    ToolManager: {
                        tools: TOOL_NAMES.map(name => ({ name })),
                        isToolCallingSupported: jest.fn(() => true),
                    },
                }),
            },
        };
    });

    afterEach(() => {
        delete globalThis.window;
    });

    test('accepts active enabled Pathfinder tools when each enabled tool is registered', async () => {
        const results = await runDiagnostics();

        expect(results['Tool Registration']).toEqual({
            ok: true,
            message: 'All 3 enabled Pathfinder tool(s) registered and active',
        });
    });

    test('reports a missing Pathfinder runtime agent even when tools are registered', async () => {
        mockRuntimeAgent = null;

        const results = await runDiagnostics();

        expect(results['Tool Registration']).toEqual({
            ok: false,
            message: 'Tool mode is enabled, but the Pathfinder tool agent is not active right now. Enable Pathfinder as a tool agent, then reopen settings or reload agents.',
        });
    });
});
