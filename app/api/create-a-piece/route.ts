import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

export async function POST(req: Request) {
    if (req.method === 'POST') {
        const { data } = await req.json();
        try {
            const supabase = createRouteHandlerClient<Database>({ cookies });
            const {
                data: { session }
            } = await supabase.auth.getSession();

            if (!session)
                throw Error("User not found")

            console.log(data)
            const { status, statusText, error } = await supabase
                .from('pieces')
                .insert(data)

            if (status === 201) {
                return new Response(JSON.stringify(statusText), { status: 201 });
            } else {
                throw Error(`${JSON.stringify(error)}`)
            }

        } catch (err: any) {
            console.log(err);
            return new Response(err, { status: 500 });
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
        try {
            const supabase = createRouteHandlerClient<Database>({ cookies });

            const { status, statusText, error } = await supabase
                .from('pieces')
                .update(data)
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
                .from('pieces')
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