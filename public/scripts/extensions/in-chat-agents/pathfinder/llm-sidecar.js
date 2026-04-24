import { generateRaw } from '../../../../script.js';
import { getSettings } from './tree-store.js';

/**
 * Generate using the default connection profile from settings
 * @param {string} prompt - User prompt
 * @param {string} [systemPrompt=''] - System prompt
 * @returns {Promise<string>}
 */
export async function sidecarGenerate(prompt, systemPrompt = '') {
    const s = getSettings();
    const profileId = s.connectionProfile ?? '';
    return sidecarGenerateWithProfile(prompt, systemPrompt, profileId);
}

/**
 * Generate using a specific connection profile
 * @param {string} prompt - User prompt
 * @param {string} [systemPrompt=''] - System prompt
 * @param {string} [profileId=''] - Connection profile ID (empty = use default/main model)
 * @param {number} [maxTokens=2048] - Maximum tokens for response
 * @returns {Promise<string>}
 */
export async function sidecarGenerateWithProfile(prompt, systemPrompt = '', profileId = '', maxTokens = 2048) {
    const ctx = window?.SillyTavern?.getContext?.();

    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });

    // Try specified profile first
    if (ctx?.ConnectionManagerRequestService && profileId) {
        const CMRS = ctx.ConnectionManagerRequestService;
        try {
            const result = await CMRS.sendRequest(profileId, messages, maxTokens, {
                extractData: true,
                includePreset: true,
                stream: false,
            });
            return typeof result === 'string' ? result : result?.content || '';
        } catch (err) {
            console.warn(`[Pathfinder] Sidecar via profile "${profileId}" failed:`, err);
        }
    }

    // Fallback to the currently selected main model. Connection Manager
    // requires a concrete profile id, so an empty id is not a valid
    // representation of "main model" here.
    try {
        return await generateRaw({
            prompt: messages,
            responseLength: maxTokens,
            trimNames: false,
        });
    } catch (err) {
        console.warn('[Pathfinder] Sidecar via main model failed:', err);
    }

    return '';
}

export function isSidecarConfigured() {
    return true;
}

export function getSidecarModelLabel() {
    const s = getSettings();
    if (s.connectionProfile) return `profile: ${s.connectionProfile}`;
    return 'main model';
}
