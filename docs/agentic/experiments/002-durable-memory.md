# 002: Stronger Durable Memory

## Title

Chapter-based durable memory for longer-horizon recall.

## Goal

Extend SillyBunny's compact memory store with chapter summaries that stay searchable across long chats.

## Inspiration

Aventuras-style agentic behavior works better when the system can recover older plot beats without dumping huge chunks of raw chat back into the prompt.

## Files touched

- [public/scripts/agents.js](/run/media/platinum/HDD/SillyBunny/public/scripts/agents.js)

## Hypothesis

If the memory agent keeps a small set of chapter summaries with keywords, the retrieval agent can recover older context more reliably while still keeping prompt injection compact.

## User-visible change

- Long-running chats should recover older events more often.
- Retrieval can search durable chapter summaries in addition to recent chat history.
- Clearing memory now removes chapter summaries too.

## Prompt / orchestration impact

- Expands the memory agent output schema with `chapters`.
- Expands retrieval with a `search_memory_chapters` tool and chapter index metadata.
- Keeps the existing director layer and service order intact.

## Data impact

- Extends chat-scoped agent memory with `chapters: [{ title, summary, keywords }]`.
- Existing chats should migrate automatically through normalization.
- No lorebook schema changes are required.

## Validation

- Enable Agent Mode and run several turns in one chat.
- Confirm the memory agent stores chapter summaries after post-generation runs.
- Confirm retrieval can use older chapter summaries when recent messages no longer contain the needed context.
- Clear agent memory and confirm chapter summaries are removed too.

## Rollback plan

If chapter memory proves noisy, fall back to the earlier summary/facts/thread memory shape by ignoring or removing the `chapters` field while keeping the director layer intact.
