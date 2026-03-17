import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { sensitiveRouteRateLimiter } from '../middleware/rateLimiter';

const router = Router();

const MODELS = ['gpt-4o', 'claude-sonnet', 'gemini-flash'] as const;
type ModelId = typeof MODELS[number];

function isValidModel(model: string): model is ModelId {
    return MODELS.includes(model as ModelId);
}

/**
 * Replace {variable} tokens in the prompt text with provided values.
 * Only replaces variables whose keys contain safe characters.
 */
function replaceVariables(text: string, variables: Record<string, string>): string {
    let result = text;
    for (const [key, value] of Object.entries(variables)) {
        if (!/^[\w]+$/.test(key)) continue; // only allow word characters in keys
        result = result.replaceAll(`{${key}}`, value);
    }
    return result;
}

// POST /api/playground/run
router.post('/run', sensitiveRouteRateLimiter, authenticate, async (req: Request, res: Response) => {
    const { promptText, model, variables } = req.body;

    if (!promptText || typeof promptText !== 'string') {
        res.status(400).json({ status: 'fail', message: 'promptText is required' });
        return;
    }

    if (!model || !isValidModel(model)) {
        res.status(400).json({ status: 'fail', message: `Invalid model. Choose one of: ${MODELS.join(', ')}` });
        return;
    }

    const safeVariables: Record<string, string> = {};
    if (variables && typeof variables === 'object') {
        for (const [k, v] of Object.entries(variables)) {
            if (typeof v === 'string') safeVariables[k] = v;
        }
    }

    const finalPrompt = replaceVariables(promptText, safeVariables);

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    try {
        if (model === 'gpt-4o') {
            await streamOpenAI(finalPrompt, res);
        } else if (model === 'claude-sonnet') {
            await streamAnthropic(finalPrompt, res);
        } else if (model === 'gemini-flash') {
            await streamGemini(finalPrompt, res);
        }
    } catch (err: any) {
        console.error('[playground] streaming error:', err);
        res.write(`data: ${JSON.stringify({ error: err.message || 'Streaming failed' })}\n\n`);
    } finally {
        res.write('data: [DONE]\n\n');
        res.end();
    }
});

// ── OpenAI (GPT-4o) ──────────────────────────────────────────────────────────
async function streamOpenAI(prompt: string, res: Response) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            stream: true,
            max_tokens: 2048,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`OpenAI API error ${response.status}: ${text}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body from OpenAI');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const data = trimmed.slice(6);
            if (data === '[DONE]') return;

            try {
                const parsed = JSON.parse(data);
                const token = parsed.choices?.[0]?.delta?.content;
                if (token) {
                    res.write(`data: ${JSON.stringify({ token })}\n\n`);
                }
            } catch {
                // skip malformed chunks
            }
        }
    }
}

// ── Anthropic (Claude Sonnet) ─────────────────────────────────────────────────
async function streamAnthropic(prompt: string, res: Response) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2048,
            stream: true,
            messages: [{ role: 'user', content: prompt }],
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Anthropic API error ${response.status}: ${text}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body from Anthropic');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const data = trimmed.slice(6);

            try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    res.write(`data: ${JSON.stringify({ token: parsed.delta.text })}\n\n`);
                }
            } catch {
                // skip malformed chunks
            }
        }
    }
}

// ── Google Generative AI (Gemini Flash) ────────────────────────────────────────
async function streamGemini(prompt: string, res: Response) {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not configured');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 2048 },
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Gemini API error ${response.status}: ${text}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body from Gemini');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const data = trimmed.slice(6);

            try {
                const parsed = JSON.parse(data);
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    res.write(`data: ${JSON.stringify({ token: text })}\n\n`);
                }
            } catch {
                // skip malformed chunks
            }
        }
    }
}

export default router;
