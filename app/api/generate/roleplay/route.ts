'/api/generate/roleplay'
import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge"
import type { NextRequest } from 'next/server'
import { roleplayPrompt } from "@/utils/prompt"

export const runtime = 'edge'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(req: NextRequest): Promise<Response> {
    if (req.method === 'POST') {
        const { messages, world, userRole, aiRole } = await req.json();
        console.log(messages, userRole, aiRole)
        try {
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo-16k",
                messages: [
                    { role: "system", content: roleplayPrompt(world, userRole, aiRole) },
                    ...messages
                ],
                max_tokens: 256,
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

