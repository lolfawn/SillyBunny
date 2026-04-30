import { getSettings, getTree, isLorebookEnabled, canReadBook, canWriteBook } from './tree-store.js';

const CHAT_LOREBOOK_METADATA_KEY = 'world_info';

const PATHFINDER_LOG_PREFIX = '[Pathfinder]';

function logPathfinderToolBridge(message, ...details) {
    console.log(`${PATHFINDER_LOG_PREFIX} ${message}`, ...details);
}

export const TOOL_NAMES = {
    SEARCH: 'Pathfinder_Search',
    REMEMBER: 'Pathfinder_Remember',
    UPDATE: 'Pathfinder_Update',
    FORGET: 'Pathfinder_Forget',
    SUMMARIZE: 'Pathfinder_Summarize',
    REORGANIZE: 'Pathfinder_Reorganize',
    MERGE_SPLIT: 'Pathfinder_MergeSplit',
    NOTEBOOK: 'Pathfinder_Notebook',
};

export const ALL_TOOL_NAMES = Object.values(TOOL_NAMES);

export const CONFIRMABLE_TOOLS = new Set([
    TOOL_NAMES.REMEMBER,
    TOOL_NAMES.UPDATE,
    TOOL_NAMES.FORGET,
    TOOL_NAMES.SUMMARIZE,
    TOOL_NAMES.REORGANIZE,
    TOOL_NAMES.MERGE_SPLIT,
]);

export function getActiveTunnelVisionBooks() {
    const s = getSettings();
    const books = Array.isArray(s.enabledLorebooks)
        ? s.enabledLorebooks.filter(b => isLorebookEnabled(b))
        : [];

    if (s.includeContextualLorebooks !== false) {
        books.push(...getContextualLorebooks());
    }

    return Array.from(new Set(books.filter(Boolean)));
}

export function getContextualLorebooks() {
    const ctx = window?.SillyTavern?.getContext?.();
    const books = [];
    const chatLorebook = ctx?.chatMetadata?.[CHAT_LOREBOOK_METADATA_KEY];
    const personaLorebook = ctx?.powerUserSettings?.persona_description_lorebook;

    if (chatLorebook) {
        books.push(chatLorebook);
    }

    if (personaLorebook) {
        books.push(personaLorebook);
    }

    for (const character of getContextCharacters(ctx)) {
        const primaryBook = character?.data?.extensions?.world || character?.data?.character_book?.name;
        if (primaryBook) {
            books.push(primaryBook);
        }

        const fileName = getCharacterFileName(character);
        const extraCharLore = ctx?.worldInfoSettings?.charLore?.find?.(entry => entry?.name === fileName);
        if (Array.isArray(extraCharLore?.extraBooks)) {
            books.push(...extraCharLore.extraBooks);
        }
    }

    return Array.from(new Set(books.filter(Boolean)));
}

function getContextCharacters(ctx) {
    if (!ctx?.characters?.length) {
        return [];
    }

    if (ctx.groupId) {
        const group = ctx.groups?.find?.(item => item?.id === ctx.groupId);
        const memberAvatars = Array.isArray(group?.members) ? group.members : [];
        return memberAvatars
            .map(avatar => ctx.characters.find(character => character?.avatar === avatar))
            .filter(Boolean);
    }

    const character = ctx.characters[ctx.characterId];
    return character ? [character] : [];
}

function getCharacterFileName(character) {
    const avatar = String(character?.avatar || '');
    return avatar.replace(/\.[^.]+$/, '');
}

export function getReadableBooks() {
    const books = getActiveTunnelVisionBooks().filter(b => canReadBook(b));
    logPathfinderToolBridge('Readable lorebooks resolved for Pathfinder.', { books });
    return books;
}

export function getWritableBooks() {
    const books = getActiveTunnelVisionBooks().filter(b => canWriteBook(b));
    logPathfinderToolBridge('Writable lorebooks resolved for Pathfinder.', { books });
    return books;
}

export function resolveTargetBook(requestedBook, writableBooks = null) {
    const books = writableBooks ?? getWritableBooks();
    if (books.length === 0) return null;
    if (requestedBook && books.includes(requestedBook)) {
        logPathfinderToolBridge('Resolved requested writable lorebook for Pathfinder tool call.', {
            requestedBook,
            selectedBook: requestedBook,
        });
        return requestedBook;
    }

    const fallbackBook = books[0];
    logPathfinderToolBridge('Falling back to the first writable lorebook for Pathfinder tool call.', {
        requestedBook: requestedBook || null,
        selectedBook: fallbackBook,
        writableBooks: books,
    });
    return fallbackBook;
}

export function getBookListWithDescriptions() {
    const books = getActiveTunnelVisionBooks();
    return books.map(b => {
        const tree = getTree(b);
        const entryCount = tree ? countAllEntries(tree) : 0;
        return `📚 ${b} (${entryCount} entries)`;
    }).join('\n');
}

function countAllEntries(tree) {
    if (!tree) return 0;
    let count = (tree.entries || []).length;
    for (const child of tree.children || []) {
        count += countAllEntries(child);
    }
    return count;
}

export function preflightToolRuntimeState() {
    const books = getActiveTunnelVisionBooks();
    const runtimeState = {
        hasBooks: books.length > 0,
        bookCount: books.length,
        books,
    };

    logPathfinderToolBridge('Preflight Pathfinder tool runtime state computed.', runtimeState);
    return runtimeState;
}

/**
 * Get entry content by UID from a lorebook
 * @param {string} bookName - Lorebook name
 * @param {number} uid - Entry UID
 * @returns {Promise<Object|null>} Entry object with uid, comment, content, etc.
 */
export async function getEntryContent(bookName, uid) {
    const ctx = window?.SillyTavern?.getContext?.();
    if (!ctx?.loadWorldInfo) {
        console.warn(`${PATHFINDER_LOG_PREFIX} Cannot fetch lorebook entry because loadWorldInfo is unavailable.`, {
            bookName,
            uid,
        });
        return null;
    }

    try {
        logPathfinderToolBridge(`Fetching Pathfinder entry ${uid} from lorebook "${bookName}".`);
        const bookData = await ctx.loadWorldInfo(bookName);
        if (!bookData?.entries) {
            console.warn(`${PATHFINDER_LOG_PREFIX} Lorebook "${bookName}" has no entries while fetching UID ${uid}.`);
            return null;
        }

        for (const entry of Object.values(bookData.entries)) {
            if (entry && entry.uid === uid) {
                logPathfinderToolBridge(`Fetched Pathfinder entry ${uid} from lorebook "${bookName}".`, {
                    title: entry.comment || entry.key?.[0] || '',
                    disabled: entry.disable ?? false,
                });
                return {
                    uid: entry.uid,
                    comment: entry.comment || entry.key?.[0] || '',
                    content: entry.content || '',
                    key: entry.key || [],
                    disable: entry.disable ?? false,
                };
            }
        }
        console.warn(`${PATHFINDER_LOG_PREFIX} Entry ${uid} was not found in lorebook "${bookName}".`);
    } catch (err) {
        console.warn(`[Pathfinder] Failed to get entry ${uid} from ${bookName}:`, err);
    }

    return null;
}

/**
 * Get all entries from a lorebook with their content
 * @param {string} bookName - Lorebook name
 * @returns {Promise<Object[]>} Array of entry objects
 */
export async function getAllEntriesWithContent(bookName) {
    const ctx = window?.SillyTavern?.getContext?.();
    if (!ctx?.loadWorldInfo) {
        console.warn(`${PATHFINDER_LOG_PREFIX} Cannot fetch lorebook contents because loadWorldInfo is unavailable.`, {
            bookName,
        });
        return [];
    }

    try {
        logPathfinderToolBridge(`Fetching all Pathfinder entries from lorebook "${bookName}".`);
        const bookData = await ctx.loadWorldInfo(bookName);
        if (!bookData?.entries) {
            console.warn(`${PATHFINDER_LOG_PREFIX} Lorebook "${bookName}" has no entries while fetching all content.`);
            return [];
        }

        const entries = Object.values(bookData.entries)
            .filter(entry => entry && !entry.disable)
            .map(entry => ({
                uid: entry.uid,
                comment: entry.comment || entry.key?.[0] || '',
                content: entry.content || '',
                key: entry.key || [],
            }));
        logPathfinderToolBridge(`Fetched lorebook contents for "${bookName}".`, {
            entryCount: entries.length,
        });
        return entries;
    } catch (err) {
        console.warn(`[Pathfinder] Failed to get entries from ${bookName}:`, err);
        return [];
    }
}
