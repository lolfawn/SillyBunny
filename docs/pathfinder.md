# Pathfinder

Pathfinder is SillyBunny's **tool-calling bridge** that lets AI models with function/tool support automatically search, create, update, and delete lorebook entries during a conversation.

---

## What It Does

When Pathfinder is enabled, the AI model can call tools to:

| Tool | Action |
|------|--------|
| **Search** | Search lorebook entries by keyword |
| **Remember** | Create a new lorebook entry |
| **Update** | Modify an existing lorebook entry |
| **Forget** | Delete a lorebook entry |
| **Summarize** | Summarize and condense entries |
| **Reorganize** | Move or restructure entries |
| **MergeSplit** | Merge small entries or split large ones |
| **Notebook** | Freeform notes storage |

This means the AI can maintain its own memory of characters, locations, events, and story state without requiring manual lorebook edits.

---

## How to Enable

1. Open the **Agents** panel in the Navigate shell
2. Toggle **Pathfinder** on
3. Select your preferred lorebook(s) for Pathfinder to work with
4. Choose the **pipeline type**: single-pass (one round of tool calls per generation) or multi-pass (allows the model to chain multiple tool calls)
5. Start chatting — the model will call Pathfinder tools when it needs to look up or store information

---

## Connection and Tool Registration

Pathfinder registers its tools via the `ToolManager` when:

- The Agents panel tab is activated
- The API provider or model changes
- Settings are updated

For Gemini (Makersuite/VertexAI) specifically, Pathfinder uses an event-driven sync that re-registers tools when:

- The main API source changes (`MAIN_API_CHANGED`)
- The chat completion source changes (`CHATCOMPLETION_SOURCE_CHANGED`)
- The model selection changes (`CHATCOMPLETION_MODEL_CHANGED`)
- The OpenAI preset changes (`OAI_PRESET_CHANGED_AFTER`)
- General settings are updated (`SETTINGS_UPDATED`)

### Diagnostics

The Pathfinder diagnostics panel (in Pathfinder Settings) checks:

1. Whether tool calling is supported for the current API/model
2. Whether tool agents are enabled
3. Which specific tools are registered
4. Whether each tool's `shouldRegister` callback returns true

If you see "0/8 tools registered," check:

- Is the current API provider one that supports tool calling? (OpenAI-compatible providers, Gemini via Makersuite/VertexAI)
- Is the "Function Calling" / "Tool Use" toggle enabled in your API settings?
- Are the Pathfinder agent entries toggled on in the Agents panel?

---

## Settings

| Setting | Description |
|---------|------------|
| **Enabled Lorebooks** | Which lorebooks Pathfinder can read and write |
| **Pipeline Type** | `single-pass` (one round) or `multi-pass` (chained rounds) |
| **Sidecar Model** | Optional separate model for LLM-based lorebook operations |
| **Skip Second Filter Pass** | Removed in v1.3.7 — use single-pass pipeline type instead |

---

## Sidecar

Pathfinder can use a **sidecar model** for lorebook operations that need LLM reasoning (like summarizing, reorganizing, or merging entries). This lets you use a cheaper or faster model for lorebook maintenance while your main model focuses on the conversation.

The sidecar connects through the same chat-completions backend with its own connection profile.

---

## Activity Feed

Pathfinder logs all tool calls in an activity feed so you can see what the AI searched for, created, updated, or deleted in real time. The feed shows:

- Tool name and action
- Entry keys affected
- Timestamp
- Success/failure status

---

## Technical Details

The Pathfinder extension lives in `public/scripts/extensions/in-chat-agents/pathfinder/`:

| File | Purpose |
|------|---------|
| `pathfinder-tool-bridge.js` | Tool definitions and registration bridge |
| `tree-store.js` | Lorebook state management and CRUD operations |
| `tree-builder.js` | Builds tool call prompts from lorebook state |
| `entry-manager.js` | Entry creation, update, and deletion logic |
| `llm-sidecar.js` | Sidecar model connection for LLM-based operations |
| `sidecar-retrieval.js` | Sidecar-based lorebook search and retrieval |
| `sidecar-writer.js` | Sidecar-based lorebook writing |
| `diagnostics.js` | Tool registration diagnostics UI |
| `conditions.js` | Tool call condition evaluation |
| `commands.js` | Slash commands for Pathfinder |
| `activity-feed.js` | Activity logging and display |
| `auto-summary.js` | Automatic entry summarization |