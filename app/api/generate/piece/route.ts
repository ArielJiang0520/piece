import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge"
import type { NextRequest } from 'next/server'
import { worldPrompt } from "@/utils/prompt"
import { getWorldDetailsById } from "@/app/supabase-server"
import { World } from "@/types/types.world"

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(req: NextRequest): Promise<Response> {
    if (req.method === 'POST') {
        const { prompt, world } = await req.json();
        try {
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: worldPrompt(world) },
                    { role: "user", content: prompt.prompt },
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

export const config = {
    runtime: "edge",
}

