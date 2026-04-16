import { event_types, eventSource } from './events.js';

const EXTRA_CONTEXT_TARGETS = Object.freeze([
    Object.freeze({
        id: 'openai',
        sliderSelector: '#openai_max_context',
        anchorSelector: '.range-block:has(#openai_max_context_counter)',
        unlockSelector: '#oai_max_context_unlocked',
        resolveContainer(anchor) {
            return anchor.nextElementSibling ?? null;
        },
    }),
    Object.freeze({
        id: 'text',
        sliderSelector: '#max_context',
        anchorSelector: '#pro-settings-block',
        unlockSelector: '#max_context_unlocked',
        resolveContainer(anchor) {
            return anchor.nextElementSibling ?? null;
        },
    }),
]);

const EXTRA_CONTEXT_SIZES = Object.freeze([
    Object.freeze({ size: 256 * 1000, label: '256k' }),
    Object.freeze({ size: 1000 * 1000, label: '1m' }),
    Object.freeze({ size: 2000 * 1000, label: '2m' }),
]);

const STARTUP_RETRY_LIMIT = 20;
const STARTUP_RETRY_MS = 250;

let initialized = false;
let queuedRetryHandle = null;

function splitContextLabel(label) {
    const match = String(label).match(/^(\d+)([A-Za-z]+)$/);
    if (!match) {
        return null;
    }

    return {
        value: match[1],
        suffix: match[2],
    };
}

function getOptionalUnlockToggle(selector) {
    const unlockToggle = document.querySelector(selector);
    return unlockToggle instanceof HTMLInputElement ? unlockToggle : null;
}

function createExtraQuickContextContainer(targetConfig, anchor) {
    if (!(anchor instanceof HTMLElement)) {
        return null;
    }

    const container = document.createElement('div');
    container.classList.add('quick_context_size_container');
    container.dataset.sbQuickContextTarget = targetConfig.id;
    anchor.insertAdjacentElement('afterend', container);
    return container;
}

function getOrCreateExtraQuickContextContainer(targetConfig, anchor) {
    const existingContainer = targetConfig.resolveContainer(anchor);
    if (existingContainer instanceof HTMLElement && existingContainer.classList.contains('quick_context_size_container')) {
        return existingContainer;
    }

    const ownedContainer = document.querySelector(`.quick_context_size_container[data-sb-quick-context-target="${targetConfig.id}"]`);
    if (ownedContainer instanceof HTMLElement) {
        return ownedContainer;
    }

    return createExtraQuickContextContainer(targetConfig, anchor);
}

function applyExtraQuickContextSize(slider, unlockToggle, size) {
    if (!(slider instanceof HTMLInputElement)) {
        return;
    }

    const currentMax = Number(slider.max || size);
    if (size > currentMax && unlockToggle instanceof HTMLInputElement && !unlockToggle.checked) {
        unlockToggle.checked = true;
        unlockToggle.dispatchEvent(new Event('input', { bubbles: true }));
        unlockToggle.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const resolvedMax = Number(slider.max || size);
    slider.value = String(Math.min(size, resolvedMax));
    slider.dispatchEvent(new Event('input', { bubbles: true }));
}

function buildExtraQuickContextButton(slider, unlockToggle, extraConfig) {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('menu_button', 'quick_context_size', 'quick_context_size_extra');
    button.dataset.sbExtra = 'true';
    button.dataset.size = String(extraConfig.size);
    button.id = `${slider.id}_quick_context_size_${extraConfig.size}`;
    button.title = `Set context to ${extraConfig.label}`;

    const splitLabel = splitContextLabel(extraConfig.label);
    if (splitLabel) {
        const value = document.createElement('span');
        value.textContent = splitLabel.value;
        button.appendChild(value);

        const suffix = document.createElement('small');
        suffix.textContent = splitLabel.suffix;
        button.appendChild(suffix);
    } else {
        button.textContent = extraConfig.label;
    }

    button.addEventListener('click', () => applyExtraQuickContextSize(slider, unlockToggle, extraConfig.size));
    return button;
}

function ensureExtraQuickContextButtons(targetConfig) {
    const anchor = document.querySelector(targetConfig.anchorSelector);
    const slider = document.querySelector(targetConfig.sliderSelector);
    const unlockToggle = getOptionalUnlockToggle(targetConfig.unlockSelector);

    if (!(anchor instanceof HTMLElement) || !(slider instanceof HTMLInputElement)) {
        return false;
    }

    const container = getOrCreateExtraQuickContextContainer(targetConfig, anchor);
    if (!(container instanceof HTMLElement)) {
        return false;
    }

    EXTRA_CONTEXT_SIZES.forEach((extraConfig) => {
        const hasButton = container.querySelector(`.quick_context_size[data-sb-extra="true"][data-size="${extraConfig.size}"]`);
        if (hasButton) {
            return;
        }

        container.appendChild(buildExtraQuickContextButton(slider, unlockToggle, extraConfig));
    });

    return true;
}

function bindExtraQuickContextButtons() {
    return EXTRA_CONTEXT_TARGETS.reduce((count, targetConfig) => {
        return count + (ensureExtraQuickContextButtons(targetConfig) ? 1 : 0);
    }, 0);
}

function scheduleQuickContextEnhancement(attempt = 0) {
    const boundTargets = bindExtraQuickContextButtons();
    if (queuedRetryHandle !== null) {
        window.clearTimeout(queuedRetryHandle);
        queuedRetryHandle = null;
    }

    if (boundTargets >= EXTRA_CONTEXT_TARGETS.length || attempt >= STARTUP_RETRY_LIMIT) {
        return;
    }

    queuedRetryHandle = window.setTimeout(() => {
        queuedRetryHandle = null;
        scheduleQuickContextEnhancement(attempt + 1);
    }, STARTUP_RETRY_MS);
}

export function initQuickContextSizeEnhancer() {
    if (initialized) {
        return;
    }

    initialized = true;

    const rebind = () => scheduleQuickContextEnhancement();
    rebind();

    eventSource.on(event_types.EXTENSION_SETTINGS_LOADED, rebind);
    eventSource.on(event_types.SETTINGS_LOADED, rebind);
    eventSource.on(event_types.APP_READY, rebind);
    eventSource.on(event_types.MAIN_API_CHANGED, rebind);
}
