import { describe, expect, jest, test } from '@jest/globals';
import { updateReasoningTokenAccounting } from '../public/scripts/reasoning-token-accounting.js';

describe('reasoning token accounting', () => {
    test('counts output and locally parsed reasoning separately', async () => {
        const message = {
            mes: 'Final answer',
            extra: {
                reasoning: 'Hidden chain of thought',
            },
        };
        const countTokens = jest.fn(async text => text.split(/\s+/).filter(Boolean).length);

        const result = await updateReasoningTokenAccounting(message, {
            countTokens,
            reasoning: message.extra.reasoning,
        });

        expect(result).toEqual({ outputTokens: 2, reasoningTokens: 4 });
        expect(message.extra.token_count).toBe(2);
        expect(message.extra.reasoning_tokens).toBe(4);
        expect(countTokens).toHaveBeenNthCalledWith(1, 'Final answer');
        expect(countTokens).toHaveBeenNthCalledWith(2, 'Hidden chain of thought');
    });

    test('preserves provider-reported reasoning tokens', async () => {
        const message = {
            mes: 'Visible output',
            extra: {
                reasoning: 'Provider thought text',
                reasoning_tokens: 17,
            },
        };
        const countTokens = jest.fn(async text => text.split(/\s+/).filter(Boolean).length);

        const result = await updateReasoningTokenAccounting(message, {
            countTokens,
            reasoning: message.extra.reasoning,
            reasoningTokens: message.extra.reasoning_tokens,
        });

        expect(result).toEqual({ outputTokens: 2, reasoningTokens: 17 });
        expect(message.extra.token_count).toBe(2);
        expect(message.extra.reasoning_tokens).toBe(17);
        expect(countTokens).toHaveBeenCalledTimes(1);
        expect(countTokens).toHaveBeenCalledWith('Visible output');
    });

    test('can avoid local reasoning estimation when token counting is disabled', async () => {
        const message = {
            mes: 'Visible output',
            extra: {
                token_count: 9,
                reasoning: 'Uncounted thought text',
            },
        };
        const countTokens = jest.fn(async () => 99);

        const result = await updateReasoningTokenAccounting(message, {
            countTokens,
            reasoning: message.extra.reasoning,
            countOutput: false,
            countReasoning: false,
        });

        expect(result).toEqual({ outputTokens: 9, reasoningTokens: 0 });
        expect(message.extra.token_count).toBe(9);
        expect(message.extra.reasoning_tokens).toBe(0);
        expect(countTokens).not.toHaveBeenCalled();
    });
});
