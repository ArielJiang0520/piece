import type { NextRequest } from 'next/server'
import { storyPrompt } from "@/utils/prompt"
import { Database } from "@/types/supabase"
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function POST(req: NextRequest): Promise<Response> {
    if (req.method === 'POST') {
        const supabase = createClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const FIREWORKS_API = process.env.FIREWORKS_AI_API_KEY
        const { prompt, model, prequel, world } = await req.json();
        let piece = null;
        if (prequel) {
            const { data, error } = await supabase
                .from('pieces')
                .select('*')
                .eq('id', prequel)
                .limit(1)
                .single();
            if (!data || error)
                throw Error(JSON.stringify(error))
            piece = data
        }

        try {
            console.log(storyPrompt(world, piece))
            const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + FIREWORKS_API
                },
                body: JSON.stringify({
                    model: "accounts/fireworks/models/deepseek-r1",
                    max_tokens: 4096,
                    top_p: 1,
                    top_k: 40,
                    presence_penalty: 0,
                    frequency_penalty: 0,
                    temperature: 0.6,
                    messages: [
                        {
                            role: "system",
                            content: storyPrompt(world, piece)
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    stream: true
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "text/event-stream;charset=utf-8",
                    "Cache-Control": "no-cache, no-transform",
                    "X-Accel-Buffering": "no",
                },
            })
        } catch (error: any) {
            console.error(error)
            return new Response(JSON.stringify(error), {
                status: 500,
                headers: {
                    "content-type": "application/json",
                },
            })
        }
    } else {
        return new Response('Method Not Allowed', {
            headers: { Allow: 'POST' },
            status: 405
        });
    }
}

