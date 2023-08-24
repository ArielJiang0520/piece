import type { Database } from '@/types/supabase';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createServerSupabaseClient = cache(() =>
    createServerComponentClient<Database>({ cookies })
);

export async function getSession() {
    const supabase = createServerSupabaseClient();
    try {
        const {
            data: { session }
        } = await supabase.auth.getSession();
        return session;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getUserDetails() {
    const supabase = createServerSupabaseClient();
    try {
        const { data: userDetails } = await supabase
            .from('profiles')
            .select('*')
            .single();
        return userDetails;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getWorldDetailsById(id: string) {
    const supabase = createServerSupabaseClient();
    try {
        const { data: worldDetails } = await supabase
            .from('worlds')
            .select()
            .eq('id', id)
            .limit(1)
            .single();
        return worldDetails;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getPiecesByWorld(id: string) {
    const supabase = createServerSupabaseClient();
    try {
        const { data, error } = await supabase
            .from('pieces')
            .select('*, profiles(*)')
            .eq('world_id', id)
            .order('created_at', { ascending: false })
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getPieceById(id: string) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('pieces')
        .select('*, profiles(*), worlds(*)')
        .eq('id', id)
        .single()

    if (!data || error) {
        throw Error(JSON.stringify(error))
    }

    return data
}




export async function downloadImage(bucket_name: string, path: string) {
    const supabase = createServerSupabaseClient();
    try {
        const { data, error } = await supabase
            .storage
            .from(bucket_name)
            .download(path)

        if (error) {
            throw error
        }

        const url = URL.createObjectURL(data)

        if (!url)
            throw Error(`Error downloading image ${error}`)

        return url;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}