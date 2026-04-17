# Dynamic Model Dropdowns

SillyBunny adds **dynamic model selection** for every chat-completions provider. When you connect to an API endpoint, SillyBunny fetches the available models and adds them to a dropdown — no more typing model names from memory.

---

## How It Works

When you click **Connect** next to any chat-completions provider:

1. SillyBunny sends a request to the provider's `/v1/models` endpoint
2. The response contains a list of available model IDs
3. Each model appears in the provider's dropdown under a **"From API"** optgroup
4. Selecting a model from the dropdown auto-fills the model name field

Providers that already had static model lists (like OpenAI's optgroups) keep their built-in entries. Dynamic models from `/v1/models` are added alongside them without replacing the known models.

---

## Providers With Dynamic Dropdowns

All 24 chat-completions providers now support dynamic model selection:

| Provider | Dropdown Type | Text Input |
|----------|---------------|------------|
| OpenAI | Select2 search + dynamic | No |
| Claude | Static optgroups + "From API" | Yes |
| AI21 | Static options + "From API" | Yes |
| Cohere | Static options + "From API" | Yes |
| Perplexity | Static options + "From API" | Yes |
| ZAI | Static options (GLM Models) + "From API" | Yes |
| VertexAI | Dynamic (Makersuite path) | Yes |
| OpenRouter | Dynamic with grouping | No |
| MistralAI | Dynamic | No |
| Custom | Datalist + dropdown | Yes |
| DeepSeek | Dynamic | No |
| Groq | Dynamic | No |
| xAI | Dynamic | No |
| AI4Chat/Pollinations | Dynamic | No |
| ElectronHub | Dynamic | No |
| Chutes | Dynamic | No |
| NanoGPT | Dynamic | No |
| AIMLAPI | Dynamic | No |
| Fireworks | Dynamic | No |
| CometAPI | Dynamic | No |
| Moonshot | Dynamic | No |
| SiliconFlow | Dynamic | No |
| Azure OpenAI | Deployment-based | No |
| OpenAI Responses | Select2 search + dynamic | No |

---

## Text Input Fallback

For providers that support it (Claude, AI21, Cohere, Perplexity, ZAI, VertexAI, Custom), you'll see a **text input field** above the dropdown. This lets you:

- Type a model name that isn't in the dropdown yet (e.g., a newly released model)
- Use custom or fine-tuned model IDs from your provider
- Override the dropdown selection manually

The text input and dropdown stay **synced**: selecting from the dropdown fills the text field, and typing in the text field updates the active model setting.

---

## Technical Details

- Model fetching happens on the **Connect** action via `/api/backends/chat-completions/status`
- The server constructs the models URL from the configured API endpoint
- Results are cached in the `model_list` global array until the next Connect
- Custom providers use the user-configured URL directly
- Azure uses deployment-based detection rather than a models endpoint
- Makersuite/VertexAI uses the Google Discovery API format

---

## Troubleshooting

**No models appear in the dropdown:**

- Check that your API key and endpoint URL are correct
- Click **Connect** again to refresh the model list
- Some providers may not support the `/v1/models` endpoint — use the text input to type the model name manually

**Dropdown shows outdated models:**

- Click **Connect** to re-fetch the current model list from the provider
- Model lists are cached until the next connection attempt