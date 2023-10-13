import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge"
import type { NextRequest } from 'next/server'
import { storyPrompt } from "@/utils/prompt"
import { Database } from "@/types/supabase"
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(req: NextRequest): Promise<Response> {
    if (req.method === 'POST') {
        const supabase = createClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

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
            const response = await openai.createChatCompletion({
                model: model,
                messages: [
                    { role: "system", content: storyPrompt(world, piece) },
                    { role: "user", content: prompt },
                ],
                max_tokens: 2048,
                temperature: 1,
                stream: true
            });

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

