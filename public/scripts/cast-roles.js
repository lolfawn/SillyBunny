import {
    characters,
    chat_metadata,
    saveMetadataDebounced,
    updateChatMetadata,
} from '../script.js';

export const CAST_METADATA_KEY = 'cast';
export const CAST_SCHEMA_VERSION = 1;

export const CAST_ACTOR_TYPES = Object.freeze({
    CHARACTER: 'character',
    PERSONA: 'persona',
});

export const CAST_CONTROL = Object.freeze({
    USER: 'user',
    AI: 'ai',
});

const DEFAULT_CAST_OPTIONS = Object.freeze({
    injectUserActorCard: true,
    includeActorLorebooks: true,
    preventAiUserControl: true,
    splitMultiSpeakerReplies: false,
});

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function findCharacterByAvatar(avatar) {
    const avatarKey = String(avatar || '');
    if (!avatarKey) {
        return null;
    }

    return characters.find(character => character?.avatar === avatarKey) || null;
}

function normalizeActor(actor) {
    if (!isObject(actor)) {
        return null;
    }

    const type = Object.values(CAST_ACTOR_TYPES).includes(actor.type) ? actor.type : CAST_ACTOR_TYPES.CHARACTER;
    const avatar = String(actor.avatar || '').trim();
    const character = type === CAST_ACTOR_TYPES.CHARACTER ? findCharacterByAvatar(avatar) : null;
    const name = String(actor.name || character?.name || '').trim();

    if (!avatar && !name) {
        return null;
    }

    return {
        type,
        avatar,
        name,
        primary: Boolean(actor.primary),
    };
}

export function normalizeCastAssignments(value = chat_metadata?.[CAST_METADATA_KEY]) {
    const source = isObject(value) ? value : {};
    const aiActors = Array.isArray(source.aiActors)
        ? source.aiActors.map(normalizeActor).filter(Boolean)
        : [];

    if (aiActors.length && !aiActors.some(actor => actor.primary)) {
        aiActors[0].primary = true;
    }

    return {
        version: CAST_SCHEMA_VERSION,
        userActor: normalizeActor(source.userActor),
        aiActors,
        options: {
            ...DEFAULT_CAST_OPTIONS,
            ...(isObject(source.options) ? source.options : {}),
        },
    };
}

export function hasCastAssignments(value = chat_metadata?.[CAST_METADATA_KEY]) {
    const cast = normalizeCastAssignments(value);
    return Boolean(cast.userActor || cast.aiActors.length);
}

export function getCastAssignments() {
    return normalizeCastAssignments(chat_metadata?.[CAST_METADATA_KEY]);
}

export function getUserActorCharacter() {
    const actor = getCastAssignments().userActor;
    return actor?.type === CAST_ACTOR_TYPES.CHARACTER ? findCharacterByAvatar(actor.avatar) : null;
}

export function getPrimaryAiActorCharacter() {
    const actor = getCastAssignments().aiActors.find(candidate => candidate.primary) || getCastAssignments().aiActors[0];
    return actor?.type === CAST_ACTOR_TYPES.CHARACTER ? findCharacterByAvatar(actor.avatar) : null;
}

export function setCastAssignments(cast, { save = true } = {}) {
    const normalized = normalizeCastAssignments(cast);
    const nextMetadata = { ...chat_metadata };

    if (hasCastAssignments(normalized)) {
        nextMetadata[CAST_METADATA_KEY] = normalized;
    } else {
        delete nextMetadata[CAST_METADATA_KEY];
    }

    updateChatMetadata(nextMetadata, true);

    if (save) {
        saveMetadataDebounced();
    }

    return getCastAssignments();
}

export function setUserActorFromCharacter(avatar, { save = true } = {}) {
    const character = findCharacterByAvatar(avatar);
    if (!character) {
        throw new Error('Character card not found for cast assignment.');
    }

    const cast = getCastAssignments();
    cast.userActor = {
        type: CAST_ACTOR_TYPES.CHARACTER,
        avatar: character.avatar,
        name: character.name,
    };

    return setCastAssignments(cast, { save });
}

export function clearUserActor({ save = true } = {}) {
    const cast = getCastAssignments();
    cast.userActor = null;
    return setCastAssignments(cast, { save });
}

export function setAiActorsFromCharacters(avatars, { save = true } = {}) {
    const actorAvatars = Array.isArray(avatars) ? avatars : [avatars];
    const aiActors = actorAvatars
        .map(findCharacterByAvatar)
        .filter(Boolean)
        .map((character, index) => ({
            type: CAST_ACTOR_TYPES.CHARACTER,
            avatar: character.avatar,
            name: character.name,
            primary: index === 0,
        }));

    const cast = getCastAssignments();
    cast.aiActors = aiActors;
    return setCastAssignments(cast, { save });
}

export function clearCastAssignments({ save = true } = {}) {
    updateChatMetadata({
        ...chat_metadata,
        [CAST_METADATA_KEY]: undefined,
    }, true);
    delete chat_metadata[CAST_METADATA_KEY];

    if (save) {
        saveMetadataDebounced();
    }
}

export function getCastDebugSummary() {
    const cast = getCastAssignments();
    return clone({
        userActor: cast.userActor,
        aiActors: cast.aiActors,
        options: cast.options,
    });
}
