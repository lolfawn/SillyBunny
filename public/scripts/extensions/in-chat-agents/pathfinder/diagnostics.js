import { getSettings, getTree, getAllEntryUids } from './tree-store.js';
import { ALL_TOOL_NAMES, getActiveTunnelVisionBooks, getContextualLorebooks } from './pathfinder-tool-bridge.js';
import { getEnabledToolAgents } from '../agent-store.js';
import { getPathfinderRuntimeAgent } from '../agent-runner.js';

function getRegisteredPathfinderTools(ToolManager) {
    return ALL_TOOL_NAMES.filter(name =>
        ToolManager?.tools?.find(t => t.name === name),
    );
}

function getEnabledPathfinderTools(pathfinderAgent, registeredTools = []) {
    if (!pathfinderAgent) {
        return [];
    }

    const agentTools = Array.isArray(pathfinderAgent?.tools) ? pathfinderAgent.tools : [];
    const agentToolNames = agentTools.map(tool => tool.name).filter(name => ALL_TOOL_NAMES.includes(name));
    const enabledAgentToolNames = agentTools
        .filter(tool => tool.enabled !== false)
        .map(tool => tool.name)
        .filter(name => ALL_TOOL_NAMES.includes(name));

    if (enabledAgentToolNames.length > 0 || agentToolNames.length > 0) {
        return Array.from(new Set(enabledAgentToolNames));
    }

    return registeredTools.filter(name => ALL_TOOL_NAMES.includes(name));
}

export async function runDiagnostics() {
    const results = {};
    const s = getSettings();

    // Check enabled lorebooks
    const manualBooks = (s.enabledLorebooks || []);
    const contextualBooks = s.includeContextualLorebooks === false ? [] : getContextualLorebooks();
    const books = getActiveTunnelVisionBooks();
    results['Lorebooks'] = {
        ok: books.length > 0,
        message: books.length > 0
            ? `${books.length} lorebook(s) available: ${books.join(', ')}. Manual: ${manualBooks.length}; contextual: ${contextualBooks.length}.`
            : 'No lorebooks selected or attached - select one above or attach chat/character/persona lore.',
    };

    // Check pipeline mode
    results['Pipeline Mode'] = {
        ok: true,
        message: s.pipelineEnabled
            ? `Enabled (${s.pipelineId || 'default'} pipeline)`
            : 'Disabled - entries won\'t be auto-injected',
    };

    // Check sidecar/tool mode
    results['Tool Mode'] = {
        ok: true,
        message: s.sidecarEnabled
            ? 'Enabled - AI can use Pathfinder tools'
            : 'Disabled - AI cannot call Pathfinder tools',
    };

    // Check trees built
    const activeBooks = getActiveTunnelVisionBooks();
    let treesBuilt = 0;
    let totalEntries = 0;

    for (const bookName of activeBooks) {
        const tree = getTree(bookName);
        if (tree) {
            treesBuilt++;
            totalEntries += getAllEntryUids(tree).length;
        }
    }

    results['Waypoint Trees'] = {
        ok: treesBuilt === activeBooks.length || activeBooks.length === 0,
        message: activeBooks.length === 0
            ? 'No lorebooks enabled'
            : treesBuilt === activeBooks.length
                ? `${treesBuilt} tree(s) built with ${totalEntries} total entries`
                : `${treesBuilt}/${activeBooks.length} trees built - some lorebooks need tree building`,
    };

    // Check tool registration
    const ToolManager = window?.SillyTavern?.getContext?.()?.ToolManager;
    const isToolCallingSupported = ToolManager?.isToolCallingSupported?.() ?? false;

    if (s.sidecarEnabled) {
        const enabledAgents = getEnabledToolAgents();
        const pathfinderAgent = getPathfinderRuntimeAgent(enabledAgents);
        const registeredTools = getRegisteredPathfinderTools(ToolManager);
        const enabledPathfinderToolNames = getEnabledPathfinderTools(pathfinderAgent, registeredTools);

        if (enabledPathfinderToolNames.length > 0 && enabledPathfinderToolNames.every(name => registeredTools.includes(name))) {
            if (isToolCallingSupported) {
                results['Tool Registration'] = {
                    ok: true,
                    message: `All ${enabledPathfinderToolNames.length} enabled Pathfinder tool(s) registered and active`,
                };
            } else {
                results['Tool Registration'] = {
                    ok: false,
                    message: `${registeredTools.length} Pathfinder tool(s) registered, but tool calling is not supported for the current API/settings. Enable "Function Calling" in OpenAI settings and ensure the current model supports tools.`,
                };
            }
        } else if (!pathfinderAgent) {
            results['Tool Registration'] = {
                ok: false,
                message: 'Tool mode is enabled, but the Pathfinder tool agent is not active right now. Enable Pathfinder as a tool agent, then reopen settings or reload agents.',
            };
        } else if (enabledPathfinderToolNames.length === 0) {
            console.debug('[Pathfinder] Diagnostics found no enabled Pathfinder tools.', {
                agentTools: pathfinderAgent?.tools ?? [],
                registeredTools,
                sidecarEnabled: s.sidecarEnabled,
            });
            results['Tool Registration'] = {
                ok: false,
                message: 'Tool mode is enabled, but every Pathfinder tool toggle is off. Re-enable at least one Pathfinder tool in Tool Settings.',
            };
        } else if (registeredTools.length === 0) {
            results['Tool Registration'] = {
                ok: false,
                message: isToolCallingSupported
                    ? 'Tools are configured but not registered with ToolManager. Try reloading the extension or switching API sources.'
                    : 'Tool calling is not supported for the current API/settings. Enable "Function Calling" in OpenAI settings and ensure the current model supports tools.',
            };
        } else {
            results['Tool Registration'] = {
                ok: false,
                message: `Partial: ${registeredTools.length}/${enabledPathfinderToolNames.length} enabled Pathfinder tools registered. Some Pathfinder tool toggles may be disabled or not yet refreshed.`,
            };
        }
    } else {
        results['Tool Registration'] = {
            ok: true,
            message: 'Tool mode disabled - skipped. Tool agents are not required unless you want Pathfinder tools.',
        };
    }

    // Check tool calling support
    if (s.sidecarEnabled && ToolManager) {
        results['Tool Calling'] = {
            ok: isToolCallingSupported,
            message: isToolCallingSupported
                ? 'Tool calling is supported for the current API/settings'
                : 'Tool calling is NOT supported. Enable "Function Calling" in OpenAI settings and ensure the current model supports tools.',
        };
    }

    // Check connection profile
    results['Connection Profile'] = {
        ok: true,
        message: s.connectionProfile
            ? `Using profile: ${s.connectionProfile}`
            : 'Using main model',
    };

    return results;
}
