import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { WorldPayload } from '@/types/types.world';

export async function POST(req: Request) {
    if (req.method === 'POST') {
        const { origin, images, title, logline, tags, description, settings } = await req.json() as WorldPayload;
        try {
            const supabase = createRouteHandlerClient<Database>({ cookies });
            const {
                data: { session }
            } = await supabase.auth.getSession();

            if (!session)
                throw Error("User not found")

            const { status, statusText } = await supabase
                .from('worlds')
                .insert({
                    origin: origin,
                    images: images,
                    world_name: title,
                    creator_id: session.user.id,
                    logline: logline,
                    tags: tags,
                    description: description,
                    public: settings.public,
                    nsfw: settings.NSFW,
                    allow_contribution: settings.allowContribution,
                    allow_suggestion: settings.allowSuggestion,
                })

            if (status === 201) {
                return new Response(JSON.stringify(statusText), { status: 201 });
            } else {
                throw Error(statusText)
            }

        } catch (err: any) {
            console.log(err);
            return new Response(JSON.stringify(err), { status: 500 });
        }
    } else {
        return new Response('Method Not Allowed', {
            headers: { Allow: 'POST' },
            status: 405
        });
    }
}