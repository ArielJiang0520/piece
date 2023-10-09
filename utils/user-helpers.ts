import { Comment, Like, Piece, Profile, Subscription, World } from '@/types/types'
import { createClientSupabaseClient } from './helpers'

export interface ProfileDetails extends Profile {
    worlds: World[] | null;
    pieces: Piece[] | null;
    subscriptions: Subscription[] | null;
    likes: Like[] | null;
    comments: Comment[] | null;
}
export const get_profile_details = async (uid: string) => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*, worlds(*), pieces(*), subscriptions(*), likes(*), comments(*)')
        .eq('id', uid)
        .single()
    if (error || !data) {
        throw Error(error.message)
    }
    return data as ProfileDetails
}


export const get_profie = async (uid: string) => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single()
    if (error || !data) {
        throw Error(error.message)
    }
    return data as Profile
}