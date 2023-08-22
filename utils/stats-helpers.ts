import { createClientSupabaseClient } from './helpers'

export const get_subscribers = async (wid: string) => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('world_id', wid)
        .order('created_at', { ascending: false })
    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }
    return data.map(item => item.user_id)
}

export const sub_to_world = async (wid: string, uid: string) => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('subscriptions')
        .insert({ world_id: wid, user_id: uid })
        .select('id')
        .single()
    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }
    return data
}

// export const is_subbed = async (wid: string, uid: string) => {
//     const supabase = createClientSupabaseClient()
//     const { data, error } = await supabase
//         .from('subscriptions')
//         .insert({ world_id: wid, user_id: uid })
//         .select('id')
//         .single()
//     if (error || !data) {
//         console.error(JSON.stringify(error))
//         throw Error(error.message)
//     }
//     return data
// }

export const unsub_to_world = async (wid: string, uid: string) => {
    const supabase = createClientSupabaseClient()

    const { status, error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', uid)
        .eq('world_id', wid)


    if (error) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }

    return status
}

