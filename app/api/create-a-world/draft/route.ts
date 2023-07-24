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

            const { status, statusText, error } = await supabase
                .from('drafts')
                .insert({
                    origin: origin === '' ? null : origin,
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

            if (!error) {
                return new Response(JSON.stringify(statusText), { status: 200 });
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

export async function PUT(req: Request) {
    if (req.method === 'PUT') {
        const { id, data } = await req.json()
        const { origin, images, title, logline, tags, description, settings } = data as WorldPayload;
        try {
            const supabase = createRouteHandlerClient<Database>({ cookies });
            const { data, status, statusText, error } = await supabase
                .from('drafts')
                .update({
                    origin: origin === '' ? null : origin,
                    images: images,
                    world_name: title,
                    logline: logline,
                    tags: tags,
                    description: description,

                    public: settings.public,
                    nsfw: settings.NSFW,
                    allow_contribution: settings.allowContribution,
                    allow_suggestion: settings.allowSuggestion,

                    modified_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()

            if (!error) {
                return new Response(JSON.stringify(statusText), { status: 200 });
            } else {
                throw Error(statusText)
            }

        } catch (err: any) {
            console.log(err);
            return new Response(JSON.stringify(err), { status: 500 });
        }
    } else {
        return new Response('Method Not Allowed', {
            headers: { Allow: 'PUT' },
            status: 405
        });
    }
}

export async function DELETE(req: Request) {
    if (req.method === 'DELETE') {
        const { id } = await req.json()
        try {
            const supabase = createRouteHandlerClient<Database>({ cookies });
            const { status, statusText, error } = await supabase
                .from('drafts')
                .delete()
                .eq('id', id)

            if (!error) {
                return new Response(JSON.stringify(statusText), { status: 200 });
            } else {
                throw Error(statusText)
            }

        } catch (err: any) {
            console.log(err);
            return new Response(JSON.stringify(err), { status: 500 });
        }
    } else {
        return new Response('Method Not Allowed', {
            headers: { Allow: 'DELETE' },
            status: 405
        });
    }
}