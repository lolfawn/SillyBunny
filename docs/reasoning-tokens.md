# Reasoning Tokens Badge

SillyBunny displays **reasoning token counts** inline on AI messages when the model reports them. This gives you visibility into how many tokens a model spent "thinking" before responding.

---

## What You See

When a model reports reasoning tokens in its response, a **💭 badge** appears next to the token count on the message:

```
1,247t  💭 342
```

The badge is only shown when reasoning tokens are present. If the model doesn't report reasoning tokens (most models don't), no badge appears.

---

## Which Models Report Reasoning Tokens

Models that use extended thinking or chain-of-thought internally may report `completion_tokens_details.reasoning_tokens` in their API response. This includes:

- **OpenAI o-series** (o1, o3, etc.) — reports reasoning tokens in the usage field
- **DeepSeek R1** and similar reasoning models
- **Any provider** that includes `reasoning_tokens` in the OpenAI-compatible usage response

Standard models without internal reasoning steps don't report this field, so no badge appears for them.

---

## How It Works

1. On streaming responses, SillyBunny extracts `usage.completion_tokens_details.reasoning_tokens` from the final SSE chunk
2. On non-streaming responses, it extracts `usage.completion_tokens_details.reasoning_tokens` from the response body
3. The count is stored in `message.extra.reasoning_tokens` in the chat data
4. When rendering a message, if `reasoning_tokens > 0`, the badge is rendered next to the token count

---

## Technical Details

- **Streaming**: The `streamData()` generator in `openai.js` adds `reasoning_tokens` to its state object and tracks updates from each chunk
- **Non-streaming**: `sendOpenAIRequest()` extracts `reasoning_tokens` from `data.usage.completion_tokens_details.reasoning_tokens`
- **Storage**: `saveReply()` accepts a `reasoningTokens` parameter and stores it in both `lastMessage.extra` and `newMessage.extra`
- **Rendering**: `updateMessageElement()` in `script.js` creates a `<span class="reasoning-tokens-badge">` element after `.tokenCounterDisplay`

The reasoning tokens count is saved to chat data, so it persists across page reloads.