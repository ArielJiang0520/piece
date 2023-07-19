import { useState } from 'react';

const useStreamText = () => {
    const [lines, setLines] = useState<string[]>(['']);
    const [isLoading, setIsLoading] = useState(false);

    const streamText = (requestBody: any, endpoint: string): Promise<string[]> => {
        return new Promise(async (resolve, reject) => {
            setIsLoading(true);
            setLines(['']);

            try {
                const response = await fetch(`${window.location.origin}/${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                const reader = response.body!.getReader();

                let text = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        resolve(lines);
                        break;
                    }

                    text += new TextDecoder().decode(value);

                    if (text.includes('\"error\":')) {
                        throw new Error(`Error in response from ${endpoint}: ${JSON.parse(text).error.message}`);
                    }

                    while (true) {
                        const eventEndIndex = text.indexOf('\n\n');
                        if (eventEndIndex === -1) {
                            break;
                        }

                        const eventData = text.slice(0, eventEndIndex);
                        if (eventData.trim() === "data: [DONE]") {
                            break;
                        }

                        text = text.slice(eventEndIndex + 2);
                        const jsonStr = eventData.trim().substring(5);
                        const event = JSON.parse(jsonStr);

                        const messageContent = event.choices?.[0]?.delta?.content || "";
                        const finishReason = event.choices?.[0]?.finish_reason;

                        if (messageContent.includes('\n')) {
                            const [lastLinePart, ...newLines] = messageContent.split('\n');
                            setLines(lines => [...lines.slice(0, -1), lines[lines.length - 1] + lastLinePart, ...newLines]);
                        } else {
                            setLines(lines => [...lines.slice(0, -1), lines[lines.length - 1] + messageContent]);
                        }

                        if (finishReason === 'stop') {
                            break;
                        }
                    }

                    if (text.endsWith('stop') || text.endsWith('[DONE]')) {
                        resolve(lines);
                        break;
                    }
                }
            } catch (error) {
                throw new Error(`Error in streamText: ${error}`);
            } finally {
                setIsLoading(false);
            }
        });
    };

    return { lines, isLoading, streamText };
};

export default useStreamText;
