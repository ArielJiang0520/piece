import type { Database } from '@/types/supabase';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { World, Profile, Piece, Folder, Like, Comment } from "@/types/types"

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

// export async function getUserDetails() {
//     const supabase = createServerSupabaseClient();
//     try {
//         const { data: userDetails } = await supabase
//             .from('profiles')
//             .select('*')
//             .single();
//         return userDetails;
//     } catch (error) {
//         console.error('Error:', error);
//         return null;
//     }
// }



// For worlds/[id]
// For WorldDisplay
export interface WorldMetadata extends World {
    profiles: Profile | null,
    pieces: any[], // count
    subscriptions: any[] // count
}
export async function getWorldMetadata(id: string): Promise<WorldMetadata> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('worlds')
        .select('*, profiles(*), pieces(count), subscriptions(count)')
        .eq('id', id)
        .limit(1)
        .single();
    if (!data || error)
        throw Error(JSON.stringify(error))
    return data as WorldMetadata
}
// For worlds/, profiles/[id]
// For AllWorlds, MyWorlds
export async function getAllWorldMetadata(uid?: string) {
    const supabase = createServerSupabaseClient();
    let query = supabase.from('worlds').select('*, profiles(*), pieces(count), subscriptions(count)')

    if (uid)
        query = query.eq('creator_id', uid).eq('is_draft', false)
    else
        query = query.eq('is_public', true).eq('is_draft', false)

    const { data, error } = await query
    if (!data || error) {
        throw Error(JSON.stringify(error))
    }
    return data as WorldMetadata[]
}

// For worlds/[id]/pieces
// For WorldPieces, PieceCard
export interface PieceDetails extends Piece {
    profiles: Profile | null,
    folders: Folder | null
}
export interface FolderCount extends Folder {
    pieces: any[] // count
}
export interface WorldDetails extends World {
    profiles: Profile | null,
    pieces: Array<PieceDetails>,
    folders: Array<FolderCount>
}
export async function getWorldDetails(id: string): Promise<WorldDetails> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('worlds')
        .select('*, profiles(*), pieces(*, profiles(*), folders(*)), folders(*, pieces(count))')
        .eq('id', id)
        .limit(1)
        .single();
    if (!data || error)
        throw Error(JSON.stringify(error))
    return data as WorldDetails
}


// For pieces/[id]
// For PieceDisplay
export interface PieceDetailsIncludeWorld extends PieceDetails {
    worlds: World | null;
    likes: Like[];
    comments: Comment[];
}
export async function getPieceDetailsIncludeWorld(
    id: string
): Promise<PieceDetailsIncludeWorld> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('pieces')
        .select('*, profiles(*), folders(*), worlds(*), likes(*), comments(*)')
        .eq('id', id)
        .limit(1)
        .single();
    if (!data || error)
        throw Error(JSON.stringify(error))
    return data as PieceDetailsIncludeWorld
}