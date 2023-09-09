import type { Database } from '@/types/supabase';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { Fandom, JoinedWorldAll, Profile, World } from '@/types/types';
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
            .select('*, profiles(*), fandoms(*), pieces(count), subscriptions(count)')
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

export async function getWorldsByUser(id: string, isOwner: boolean) {
    const supabase = createServerSupabaseClient();

    let query = supabase
        .from('worlds')
        .select('*, profiles(*), fandoms(*), pieces(count), subscriptions(count)')
        .eq('creator_id', id)
        .eq('is_draft', false)

    if (!isOwner) { query = query.eq('is_public', true) }

    const { data, error } = await query

    if (!data || error) {
        throw Error('Failed at fetching worlds')
    }

    return data;
}

export async function getAllWorlds() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('worlds')
        .select('*, profiles(*), fandoms(*), pieces(count), subscriptions(count)')
        .eq('is_public', true)
        .eq('is_draft', false)

    if (!data || error) {
        throw Error(JSON.stringify(error))
    }

    return data
}

// export async function getNumPieces(wid: string) {
//     const supabase = createServerSupabaseClient();
//     const { data, error } = await supabase
//         .from('pieces')
//         .select('id', { count: 'exact' })
//         .eq('world_id', wid)
//     if (error || !data) {
//         console.error(JSON.stringify(error))
//         throw Error(error.message)
//     }
//     return data.length
// }

// export async function getNumSubs(wid: string) {
//     const supabase = createServerSupabaseClient()
//     const { data, error } = await supabase
//         .from('subscriptions')
//         .select('id', { count: 'exact' })
//         .eq('world_id', wid)
//     if (error || !data) {
//         console.error(JSON.stringify(error))
//         throw Error(error.message)
//     }
//     return data.length
// }


// export const getWorldsJoinedData = async (worlds: JoinedWorldDetails[]) => {
//     let myPromises: Promise<JoinedWorldAll>[] = worlds.map((obj) => {
//         return Promise.all([getNumPieces(obj.id), getNumSubs(obj.id)]).then(([numPieces, numSubs]) => {
//             return {
//                 ...obj,
//                 numPieces: numPieces,
//                 numSubs: numSubs
//             };
//         });
//     });

//     return await Promise.all(myPromises);
// }
