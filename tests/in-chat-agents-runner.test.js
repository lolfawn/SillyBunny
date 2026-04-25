/* global document, globalThis */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

function createEventSource() {
    const handlers = new Map();

    return {
        on: jest.fn((event, handler) => {
            const eventHandlers = handlers.get(event) ?? [];
            eventHandlers.push(handler);
            handlers.set(event, eventHandlers);
        }),
        emit: jest.fn(async (event, ...args) => {
            const eventHandlers = [...(handlers.get(event) ?? [])];
            for (const handler of eventHandlers) {
                await handler(...args);
            }
        }),
        removeListener: jest.fn((event, handler) => {
            const eventHandlers = handlers.get(event) ?? [];
            handlers.set(event, eventHandlers.filter(item => item !== handler));
        }),
    };
}

describe('in-chat agent post-processing runner', () => {
    let chat;
    let chatMetadata;
    let extensionPrompts;
    let enabledAgents;
    let eventSource;
    let eventTypes;
    let saveChatDebounced;
    let saveChat;
    let generateQuietPrompt;

    beforeEach(async () => {
        jest.resetModules();
        jest.useRealTimers();

        chat = [];
        chatMetadata = {};
        extensionPrompts = {};
        enabledAgents = [];
        eventSource = createEventSource();
        eventTypes = {
            GENERATION_STARTED: 'generation_started',
            GENERATION_AFTER_COMMANDS: 'generation_after_commands',
            GENERATION_ENDED: 'generation_ended',
            GENERATION_STOPPED: 'generation_stopped',
            MESSAGE_RECEIVED: 'message_received',
            MESSAGE_EDITED: 'message_edited',
            IMPERSONATE_READY: 'impersonate_ready',
            MESSAGE_SWIPED: 'message_swiped',
            CHAT_COMPLETION_SETTINGS_READY: 'chat_completion_settings_ready',
            WORLDINFO_ENTRIES_LOADED: 'worldinfo_entries_loaded',
            CHAT_CHANGED: 'chat_changed',
            WORLDINFO_UPDATED: 'worldinfo_updated',
            MESSAGE_UPDATED: 'message_updated',
        };
        saveChatDebounced = jest.fn();
        saveChat = jest.fn();
        generateQuietPrompt = jest.fn(async () => 'quiet result');

        globalThis.document = {
            body: { dataset: {} },
            querySelector: jest.fn(() => null),
            getElementById: jest.fn(() => null),
        };
        globalThis.HTMLSelectElement = class HTMLSelectElement {};
        globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
        globalThis.toastr = {
            clear: jest.fn(),
            error: jest.fn(),
            info: jest.fn(),
            success: jest.fn(),
            warning: jest.fn(),
        };
        const createJqueryMock = () => ({
            each: jest.fn(),
            filter: jest.fn(() => createJqueryMock()),
            find: jest.fn(() => createJqueryMock()),
            first: jest.fn(() => createJqueryMock()),
            length: 0,
            text: jest.fn(() => ''),
            trigger: jest.fn(),
            trim: jest.fn(() => ''),
        });
        globalThis.$ = jest.fn(() => createJqueryMock());

        await jest.unstable_mockModule('../public/script.js', () => ({
            chat,
            chat_metadata: chatMetadata,
            ensureSwipes: jest.fn((message) => {
                message.swipes ??= [message.mes];
                message.swipe_id ??= 0;
            }),
            extension_prompt_roles: { SYSTEM: 0 },
            extension_prompt_types: { IN_PROMPT: 0, IN_CHAT: 1 },
            extension_prompts: extensionPrompts,
            setExtensionPrompt: jest.fn((key, value) => {
                extensionPrompts[key] = { value };
            }),
            substituteParams: jest.fn(value => String(value ?? '')),
            generateQuietPrompt,
            normalizeContentText: jest.fn(value => String(value ?? '')),
            saveChatDebounced,
            stopGeneration: jest.fn(() => false),
            streamingProcessor: null,
            syncMesToSwipe: jest.fn(),
        }));

        await jest.unstable_mockModule('../public/scripts/extensions.js', () => ({
            getContext: jest.fn(() => ({ saveChat })),
        }));

        await jest.unstable_mockModule('../public/scripts/events.js', () => ({
            eventSource,
            event_types: eventTypes,
        }));

        await jest.unstable_mockModule('../public/scripts/tool-calling.js', () => ({
            ToolManager: {
                RECURSE_LIMIT: 5,
                canPerformToolCalls: jest.fn(() => false),
                hasToolCalls: jest.fn(() => false),
                isToolCallingSupported: jest.fn(() => false),
                registerFunctionTool: jest.fn(),
                unregisterFunctionTool: jest.fn(),
            },
        }));

        await jest.unstable_mockModule('../public/scripts/extensions/in-chat-agents/agent-store.js', () => ({
            DEFAULT_AGENT_MAX_TOKENS: 8192,
            getAgentById: jest.fn(id => enabledAgents.find(agent => agent.id === id)),
            getAgentRegexScripts: jest.fn(() => []),
            getEnabledAgents: jest.fn(() => [...enabledAgents]),
            getEnabledToolAgents: jest.fn(() => []),
            getGlobalSettings: jest.fn(() => ({
                enabled: true,
                promptTransformShowNotifications: false,
            })),
            isToolAgent: jest.fn(() => false),
            resolveConnectionProfile: jest.fn(value => value ?? ''),
        }));

        await jest.unstable_mockModule('../public/scripts/extensions/in-chat-agents/tool-action-registry.js', () => ({
            getToolAction: jest.fn(() => null),
            getToolFormatter: jest.fn(() => null),
        }));

        await jest.unstable_mockModule('../public/scripts/extensions/in-chat-agents/pathfinder/tree-store.js', () => ({
            getAllEntryUids: jest.fn(() => []),
            getSettings: jest.fn(() => ({ pipelinePrompts: {}, pipelines: [] })),
            getTree: jest.fn(() => null),
            setSettings: jest.fn(),
        }));

        await jest.unstable_mockModule('../public/scripts/extensions/in-chat-agents/pathfinder/sidecar-retrieval.js', () => ({
            PATHFINDER_RETRIEVAL_PROMPT_KEYS: [],
            runSidecarRetrieval: jest.fn(),
        }));

        await jest.unstable_mockModule('../public/scripts/extensions/in-chat-agents/pathfinder/auto-summary.js', () => ({
            markAutoSummaryComplete: jest.fn(),
            shouldAutoSummarize: jest.fn(() => false),
        }));
    });

    afterEach(() => {
        delete globalThis.document;
        delete globalThis.HTMLSelectElement;
        delete globalThis.requestAnimationFrame;
        delete globalThis.toastr;
        delete globalThis.$;
    });

    function useAppendPostAgent() {
        enabledAgents = [{
            id: 'agent-post-append',
            name: 'Post Append',
            phase: 'post',
            prompt: '',
            injection: { order: 100 },
            postProcess: {
                enabled: true,
                type: 'append',
                appendText: '\n[post processed]',
                promptTransformEnabled: false,
            },
            conditions: {
                triggerKeywords: [],
                triggerProbability: 100,
                generationTypes: ['normal'],
            },
        }];
    }

    function useManualTransformAgents() {
        enabledAgents = [
            {
                id: 'agent-manual-a',
                name: 'Manual A',
                phase: 'post',
                prompt: 'Rewrite as A',
                injection: { order: 100 },
                postProcess: {
                    enabled: false,
                    promptTransformEnabled: true,
                    promptTransformMode: 'rewrite',
                    promptTransformMaxTokens: 8192,
                },
                conditions: {
                    triggerKeywords: [],
                    triggerProbability: 100,
                    generationTypes: ['normal'],
                },
            },
            {
                id: 'agent-manual-b',
                name: 'Manual B',
                phase: 'post',
                prompt: 'Rewrite as B',
                injection: { order: 110 },
                postProcess: {
                    enabled: false,
                    promptTransformEnabled: true,
                    promptTransformMode: 'rewrite',
                    promptTransformMaxTokens: 8192,
                },
                conditions: {
                    triggerKeywords: [],
                    triggerProbability: 100,
                    generationTypes: ['normal'],
                },
            },
        ];
    }

    async function waitFor(condition) {
        for (let i = 0; i < 20; i++) {
            if (condition()) {
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    test('does not mark normal chat generation as active agent generation', async () => {
        const { initAgentRunner, isAgentGenerationActive } = await import('../public/scripts/extensions/in-chat-agents/agent-runner.js');
        initAgentRunner();

        expect(isAgentGenerationActive()).toBe(false);

        await eventSource.emit(eventTypes.GENERATION_STARTED, 'normal', {}, false);

        expect(isAgentGenerationActive()).toBe(false);

        await eventSource.emit(eventTypes.GENERATION_ENDED, chat.length);

        expect(isAgentGenerationActive()).toBe(false);
    });

    test('queues manual agent runs while another manual agent is active', async () => {
        useManualTransformAgents();
        const quietResolvers = [];
        generateQuietPrompt.mockImplementation(async () => await new Promise(resolve => quietResolvers.push(resolve)));
        chat.push({
            name: 'Assistant',
            mes: 'Original reply',
            is_user: false,
            is_system: false,
            extra: {},
        });

        const { isAgentGenerationActive, runAgentOnMessage } = await import('../public/scripts/extensions/in-chat-agents/agent-runner.js');

        const firstRun = runAgentOnMessage('agent-manual-a', 0);
        await waitFor(() => generateQuietPrompt.mock.calls.length === 1);

        expect(isAgentGenerationActive()).toBe(true);

        const secondRun = runAgentOnMessage('agent-manual-b', 0);
        await waitFor(() => quietResolvers.length === 1);

        expect(generateQuietPrompt).toHaveBeenCalledTimes(1);
        expect(toastr.info).toHaveBeenCalledWith('Queued agent run.');

        quietResolvers.shift()('First rewrite');
        const firstResult = await firstRun;

        expect(firstResult.status).toBe('changed');
        expect(chat[0].mes).toBe('First rewrite');

        await waitFor(() => generateQuietPrompt.mock.calls.length === 2);

        expect(generateQuietPrompt).toHaveBeenCalledTimes(2);
        expect(isAgentGenerationActive()).toBe(true);

        quietResolvers.shift()('Second rewrite');
        const secondResult = await secondRun;

        expect(secondResult.status).toBe('changed');
        expect(chat[0].mes).toBe('Second rewrite');
        expect(toastr.warning).not.toHaveBeenCalledWith('Cannot run an agent while another is in progress.');
        expect(isAgentGenerationActive()).toBe(false);
    });

    test('defers enabled post-processing agents until the main generation is idle', async () => {
        useAppendPostAgent();

        const { initAgentRunner } = await import('../public/scripts/extensions/in-chat-agents/agent-runner.js');
        initAgentRunner();

        await eventSource.emit(eventTypes.GENERATION_STARTED, 'normal', {}, false);
        document.body.dataset.generating = 'true';
        chat.push({
            name: 'Assistant',
            mes: 'Fresh reply',
            is_user: false,
            is_system: false,
            extra: {},
        });

        await eventSource.emit(eventTypes.MESSAGE_RECEIVED, 0, 'normal');

        expect(chat[0].mes).toBe('Fresh reply');
        expect(saveChatDebounced).not.toHaveBeenCalled();

        delete document.body.dataset.generating;
        await eventSource.emit(eventTypes.GENERATION_ENDED, chat.length);
        await new Promise(resolve => setTimeout(resolve, 5));

        expect(chat[0].mes).toBe('Fresh reply\n[post processed]');
        expect(saveChatDebounced).toHaveBeenCalledTimes(1);
    });

    test('keeps deferred group-style post-processing when another generation starts first', async () => {
        useAppendPostAgent();

        const { initAgentRunner } = await import('../public/scripts/extensions/in-chat-agents/agent-runner.js');
        initAgentRunner();

        await eventSource.emit(eventTypes.GENERATION_STARTED, 'normal', {}, false);
        document.body.dataset.generating = 'true';
        chat.push({
            name: 'Assistant One',
            mes: 'First speaker',
            is_user: false,
            is_system: false,
            extra: {},
        });
        await eventSource.emit(eventTypes.MESSAGE_RECEIVED, 0, 'normal');

        delete document.body.dataset.generating;
        await eventSource.emit(eventTypes.GENERATION_ENDED, chat.length);

        await eventSource.emit(eventTypes.GENERATION_STARTED, 'normal', {}, false);
        document.body.dataset.generating = 'true';
        chat.push({
            name: 'Assistant Two',
            mes: 'Second speaker',
            is_user: false,
            is_system: false,
            extra: {},
        });
        await eventSource.emit(eventTypes.MESSAGE_RECEIVED, 1, 'normal');

        delete document.body.dataset.generating;
        await eventSource.emit(eventTypes.GENERATION_ENDED, chat.length);
        await new Promise(resolve => setTimeout(resolve, 5));

        expect(chat[0].mes).toBe('First speaker\n[post processed]');
        expect(chat[1].mes).toBe('Second speaker\n[post processed]');
        expect(saveChatDebounced).toHaveBeenCalledTimes(2);
    });
});
