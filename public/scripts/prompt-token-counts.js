'use strict';

function getTokenCount(item) {
    const tokenCount = Number(item?.getTokens?.() ?? 0);
    return Number.isFinite(tokenCount) ? tokenCount : 0;
}

function getCollection(item) {
    const collection = item?.getCollection?.();
    return Array.isArray(collection) ? collection : null;
}

function addCount(counts, identifier, tokens) {
    if (!identifier) {
        return;
    }

    const tokenCount = Number(tokens);
    if (!Number.isFinite(tokenCount)) {
        return;
    }

    counts[identifier] = (counts[identifier] ?? 0) + tokenCount;
}

function collectDirectMessageCounts(item, counts) {
    const collection = getCollection(item);
    if (collection) {
        for (const child of collection) {
            collectDirectMessageCounts(child, counts);
        }
        return;
    }

    addCount(counts, item?.identifier, getTokenCount(item));
}

export function getPromptDisplayTokenCounts(messages) {
    const rootCollection = getCollection(messages) ?? [];
    const aggregateCounts = {};
    const directCounts = {};

    for (const item of rootCollection) {
        addCount(aggregateCounts, item?.identifier, getTokenCount(item));
        collectDirectMessageCounts(item, directCounts);
    }

    return { ...aggregateCounts, ...directCounts };
}
