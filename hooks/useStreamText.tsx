'use client';
import { useState, useRef, useCallback } from 'react';

export interface StreamResult {
    lines: string[];
    reasoning: string;
    usage: StreamUsage | null;
}

interface StreamUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

const useStreamText = () => {
    const [lines, setLines] = useState<string[]>(['']);
    const [reasoning, setReasoning] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    const linesRef = useRef<string[]>(['']);
    const reasoningRef = useRef<string>('');
    const usageRef = useRef<StreamUsage | null>(null);

    const updateLines = (updater: (prev: string[]) => string[]) => {
        linesRef.current = updater(linesRef.current);
        setLines(linesRef.current);
    };

    const resetLines = useCallback(() => {
        linesRef.current = [''];
        reasoningRef.current = '';
        usageRef.current = null;
        setLines(['']);
        setReasoning('');
    }, []);

    const appendContent = (content: string) => {
        if (!content) return;
        const parts = content.split('\n');
        updateLines((prev) => {
            const next = [...prev];
            next[next.length - 1] += parts[0];
            for (let i = 1; i < parts.length; i++) next.push(parts[i]);
            return next;
        });
    };

    const appendReasoning = (chunk: string) => {
        if (!chunk) return;
        reasoningRef.current += chunk;
        setReasoning(reasoningRef.current);
    };

    const streamText = async (
        requestBody: any,
        endpoint: string,
        signal?: AbortSignal
    ): Promise<StreamResult> => {
        setIsLoading(true);
        setIsThinking(false);
        resetLines();

        const decoder = new TextDecoder();
        let buffer = '';
        let sawContent = false;

        try {
            const response = await fetch(
                `${window.location.origin}${endpoint}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                    signal,
                }
            );

            // Pre-stream errors come back as non-200 with a JSON error body
            if (!response.ok) {
                const errText = await response.text().catch(() => response.statusText);
                throw new Error(`HTTP ${response.status}: ${errText}`);
            }
            if (!response.body) throw new Error('Response has no body');

            const reader = response.body.getReader();

            streamLoop: while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                let sepIndex: number;
                while ((sepIndex = findEventSeparator(buffer)) !== -1) {
                    const rawEvent = buffer.slice(0, sepIndex);
                    buffer = buffer.slice(sepIndex + separatorLength(buffer, sepIndex));

                    const parsed = parseSseEvent(rawEvent);
                    if (parsed === null) continue; // comments like `: OPENROUTER PROCESSING`
                    if (parsed === '[DONE]') break streamLoop;

                    let event: any;
                    try {
                        event = JSON.parse(parsed);
                    } catch {
                        console.warn('Skipping malformed SSE payload:', parsed);
                        continue;
                    }

                    // Mid-stream errors: top-level error field with finish_reason "error"
                    // HTTP status is already 200 at this point so we check the payload
                    if (event.error) {
                        throw new Error(
                            event.error.message ?? 'Unknown streaming error'
                        );
                    }

                    // Capture usage from the final chunk
                    if (event.usage) {
                        usageRef.current = event.usage;
                    }

                    const choice = event.choices?.[0];
                    if (!choice) continue;

                    const delta = choice.delta ?? {};
                    const reasoningChunk: string =
                        delta.reasoning_content
                        ?? delta.reasoning
                        ?? delta.reasoning_details?.[0]?.text  // newer structured format
                        ?? '';
                    const contentChunk: string = delta.content ?? '';
                    const finishReason: string | null = choice.finish_reason ?? null;

                    // Reasoning phase
                    if (reasoningChunk) {
                        if (!sawContent) setIsThinking(true);
                        appendReasoning(reasoningChunk);
                    }

                    // Content phase — first content token means reasoning is done
                    if (contentChunk) {
                        if (!sawContent) {
                            sawContent = true;
                            setIsThinking(false);
                        }
                        if (contentChunk !== '</s>' && contentChunk !== '<|endoftext|>') {
                            appendContent(contentChunk);
                        }
                    }

                    // finish_reason "error" without an error object (defensive)
                    if (finishReason === 'error') {
                        throw new Error('Stream terminated with finish_reason "error"');
                    }

                    if (finishReason) break streamLoop;
                }
            }

            return {
                lines: linesRef.current,
                reasoning: reasoningRef.current,
                usage: usageRef.current,
            };
        } catch (error) {
            if ((error as any)?.name === 'AbortError') {
                return {
                    lines: linesRef.current,
                    reasoning: reasoningRef.current,
                    usage: usageRef.current,
                };
            }
            throw error instanceof Error ? error : new Error(String(error));
        } finally {
            setIsLoading(false);
            setIsThinking(false);
        }
    };

    return { lines, reasoning, isLoading, isThinking, resetLines, streamText };
};

// --- SSE helpers ---

function findEventSeparator(buf: string): number {
    const a = buf.indexOf('\n\n');
    const b = buf.indexOf('\r\n\r\n');
    if (a === -1) return b;
    if (b === -1) return a;
    return Math.min(a, b);
}

function separatorLength(buf: string, idx: number): number {
    return buf.startsWith('\r\n\r\n', idx) ? 4 : 2;
}

function parseSseEvent(rawEvent: string): string | null {
    const dataLines: string[] = [];
    for (const rawLine of rawEvent.split(/\r?\n/)) {
        if (rawLine === '' || rawLine.startsWith(':')) continue;
        const colon = rawLine.indexOf(':');
        const field = colon === -1 ? rawLine : rawLine.slice(0, colon);
        let value = colon === -1 ? '' : rawLine.slice(colon + 1);
        if (value.startsWith(' ')) value = value.slice(1);
        if (field === 'data') dataLines.push(value);
    }
    if (dataLines.length === 0) return null;
    return dataLines.join('\n');
}

export default useStreamText;