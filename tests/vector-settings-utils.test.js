import { describe, expect, test } from '@jest/globals';
import {
    applyLegacyVectorEnabledSetting,
    bindVectorEnabledSettingsStore,
    coerceVectorBoolean,
    getVectorEnabledState,
    normalizeVectorEnabledOptions,
} from '../public/scripts/extensions/vectors/settings-utils.js';

describe('vector settings utilities', () => {
    test('coerces common extension boolean values', () => {
        expect(coerceVectorBoolean(true)).toBe(true);
        expect(coerceVectorBoolean(false)).toBe(false);
        expect(coerceVectorBoolean('on')).toBe(true);
        expect(coerceVectorBoolean('enabled')).toBe(true);
        expect(coerceVectorBoolean('off')).toBe(false);
        expect(coerceVectorBoolean('disabled')).toBe(false);
        expect(coerceVectorBoolean(1)).toBe(true);
        expect(coerceVectorBoolean(0)).toBe(false);
    });

    test('migrates saved legacy enabled flag to chat RAG', () => {
        const settings = { enabled_chats: false };

        applyLegacyVectorEnabledSetting(settings, { enabled: true });

        expect(settings.enabled_chats).toBe(true);
    });

    test('does not let legacy enabled false disable an explicit chat flag', () => {
        const settings = { enabled_chats: true };

        applyLegacyVectorEnabledSetting(settings, { enabled: false });

        expect(settings.enabled_chats).toBe(true);
    });

    test('normalizes extension-facing RAG enable options', () => {
        expect(normalizeVectorEnabledOptions()).toEqual({ enabled_chats: true });
        expect(normalizeVectorEnabledOptions(false)).toEqual({ enabled_chats: false });
        expect(normalizeVectorEnabledOptions({ enabled: 'true', files: 'on', worldInfo: 1 })).toEqual({
            enabled_chats: true,
            enabled_files: true,
            enabled_world_info: true,
        });
    });

    test('returns extension-facing enabled state aliases', () => {
        expect(getVectorEnabledState({
            enabled_chats: true,
            enabled_files: false,
            enabled_world_info: true,
        })).toEqual({
            enabled: true,
            chats: true,
            files: false,
            worldInfo: true,
            enabled_chats: true,
            enabled_files: false,
            enabled_world_info: true,
        });
    });

    test('binds saved enabled flags to live runtime settings', () => {
        const settings = {
            enabled_chats: false,
            enabled_files: false,
            enabled_world_info: false,
        };
        const store = {
            enabled_chats: false,
            enabled_files: false,
            enabled_world_info: false,
        };
        let changeCount = 0;

        bindVectorEnabledSettingsStore(settings, store, () => {
            changeCount++;
        });

        store.enabled_chats = true;
        store.enabled_files = 'on';
        store.enabled_world_info = 1;

        expect(settings).toEqual({
            enabled_chats: true,
            enabled_files: true,
            enabled_world_info: true,
        });
        expect(store.enabled).toBe(true);
        expect(changeCount).toBe(3);
    });

    test('legacy enabled setter toggles live chat RAG', () => {
        const settings = {
            enabled_chats: false,
            enabled_files: false,
            enabled_world_info: false,
        };
        const store = { enabled: true };

        bindVectorEnabledSettingsStore(settings, store);
        expect(settings.enabled_chats).toBe(true);

        store.enabled = false;
        expect(settings.enabled_chats).toBe(false);
    });
});
