# Playable Character Cards / Cast Roles Plan

## Goal
Allow the same character card format to be assigned either to the human user or to the AI for a specific chat. This removes the need to separately recreate a character as a Persona when the user wants to play that card, while also opening a path to AI-controlled casts with character-card lorebook support.

## User-Facing Concept
Add a per-chat **Cast / Roles** workflow:

- **You play as:** one character card, persona, or default user profile.
- **AI plays as:** one or more character cards.
- **Inactive:** available cards not participating in this chat.

The assignment belongs to the chat, not the character card. The same card can be user-controlled in one chat and AI-controlled in another.

## Why This Is Not Just Existing Persona Support
Current flows separate:

- character cards: usually written as `{{char}}`
- personas: usually written as `{{user}}`

The proposed cast layer treats both as actors and maps them into the prompt according to their current role. Existing Persona behavior remains as the compatibility fallback.

## Data Model
Store actor assignment in `chat_metadata.cast`.

```json
{
  "cast": {
    "version": 1,
    "userActor": {
      "type": "character",
      "avatar": "alice.png",
      "name": "Alice"
    },
    "aiActors": [
      {
        "type": "character",
        "avatar": "bob.png",
        "name": "Bob",
        "primary": true
      }
    ],
    "options": {
      "injectUserActorCard": true,
      "includeActorLorebooks": true,
      "preventAiUserControl": true,
      "splitMultiSpeakerReplies": false
    }
  }
}
```

Rules:

- `type: "character"` references existing character cards by avatar filename.
- `type: "persona"` can reference an existing persona avatar if needed later.
- `userActor` is optional; when absent, existing persona behavior is used.
- `aiActors` is optional; when absent, current selected character/group behavior is used.

## MVP Scope
The first safe implementation should be small and backwards-compatible:

1. Add a cast assignment model in chat metadata.
2. Add UI controls to select a user-controlled character card for the current chat.
3. Use that card's name/avatar for user messages only when enabled.
4. Inject that card's description as the user profile/persona context.
5. Keep the existing selected character as the primary AI actor.
6. Do not change normal chats unless `chat_metadata.cast.userActor` exists.

## Full Feature Scope
After MVP:

1. Multi-select AI-controlled characters.
2. Include lorebooks attached to all active actors.
3. Add actor-specific prompt blocks:
   - User actor card
   - Primary AI actor card
   - Supporting AI actor cards
   - Actor lorebook context
4. Add prompt instructions:
   - User controls the user actor.
   - Assistant controls only AI actors.
   - Assistant must not narrate user actor actions unless allowed.
5. Optional multi-speaker output parsing:
   - `Bob: ...`
   - `Clara: ...`
   - split generated content into separate messages with correct avatars.
6. Per-chat cast presets.

## Prompt Strategy
For single AI actor:

```txt
The human user is roleplaying as Alice.
Alice's character card:
...

The assistant is roleplaying as Bob.
Bob's character card:
...

Do not write Alice's actions or dialogue unless explicitly requested.
```

For multiple AI actors:

```txt
The human user controls Alice.
The assistant controls Bob and Clara.
When writing dialogue for AI-controlled actors, prefix each spoken turn with the speaker name.
Never write actions or dialogue for Alice unless explicitly requested.
```

## Macro Compatibility
Existing cards may use `{{user}}` and `{{char}}`.

MVP recommendation:

- For user-controlled character injection, substitute:
  - `{{user}}` -> user actor name
  - `{{char}}` -> primary AI actor name when available
- For AI-controlled cards, keep existing behavior:
  - `{{char}}` -> that AI actor
  - `{{user}}` -> user actor/persona name

Expose macro remapping as an option later if users find it surprising.

## Lorebook Support
Actor lorebooks should be gathered from:

- active user actor card
- active AI actor cards
- current chat/character/global lorebooks

Each lorebook should retain source metadata:

```json
{
  "name": "Alice Memories",
  "sourceActor": "Alice",
  "control": "user"
}
```

This allows Pathfinder and World Info logs to show which actor contributed injected lore.

## UI Plan
Add a Cast/Roles section, likely under Characters or Persona:

- Current chat cast status card.
- “You play as” character picker.
- “AI plays as” picker/multi-picker.
- Toggles:
  - Inject user actor card
  - Include actor lorebooks
  - Prevent AI from controlling user actor
  - Split multi-speaker replies
- Reset button: return to normal Persona + selected character behavior.

## Implementation Phases

### Phase 1: Foundation
- Add `public/scripts/cast-roles.js`.
- Normalize `chat_metadata.cast`.
- Provide getters/setters:
  - `getCastAssignments()`
  - `setUserActorFromCharacter(avatar)`
  - `clearUserActor()`
  - `setAiActors(avatars)`
  - `getUserActorCharacter()`
- No behavior changes yet except metadata persistence helpers.

### Phase 2: UI Entry Point
- Add a small Cast/Roles panel in Customize or Characters.
- Show current user actor and primary AI actor.
- Allow selecting/resetting a user actor from existing character cards.

### Phase 3: User Message Identity
- When cast user actor is enabled, user messages use that card's name/avatar.
- Existing personas remain fallback.

### Phase 4: Prompt Injection
- Inject user actor card as persona-like context.
- Add guardrail instruction preventing AI from controlling the user actor.

### Phase 5: Actor Lorebooks
- Discover and include lorebooks attached to cast actors.
- Surface actor-source metadata in World Info / Pathfinder logs.

### Phase 6: Multi-AI Cast
- Allow multiple AI actors.
- Build cast prompt sections.
- Add optional speaker parsing/splitting.

## Risks
- Macro remapping can surprise users.
- Multi-speaker parsing can mangle normal prose.
- Actor lorebook inclusion can increase prompt size quickly.
- Existing group chat logic overlaps with this feature and should be reused where practical.

## Acceptance Criteria for MVP
- Existing chats behave exactly the same with no `chat_metadata.cast`.
- User can select a character card as their current chat actor.
- Assignment persists in the chat metadata.
- Reset removes the cast metadata.
- Prompt/user identity integration can be added without migrating existing cards.
