import { GenPieceJson } from '@/types/types';
import { createClientSupabaseClient } from './helpers'

export const fetch_prompt = async (prompt_id: string) => {
    const supabase = createClientSupabaseClient();
    const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', prompt_id)
        .single()
    if (error || !data)
        throw `Error in getPrompt ${JSON.stringify(error)}`
    return data
}

export const fav_prompt = async (pid: string) => {
    const supabase = createClientSupabaseClient();
    const { data, error } = await supabase
        .from('prompts')
        .update({ is_favorite: true })
        .eq('id', pid)
        .select('id')
        .single()

    if (error || !data) {
        throw Error(error.message)
    }
    return data
}

export const unfav_prompt = async (pid: string) => {
    const supabase = createClientSupabaseClient();
    const { data, error } = await supabase
        .from('prompts')
        .update({ is_favorite: false })
        .eq('id', pid)
        .select('id')
        .single()

    if (error || !data) {
        throw Error(error.message)
    }
    return data
}


export const fetch_num_of_prompts = async (wid: string) => {
    const supabase = createClientSupabaseClient()
    const { data, error, status } = await supabase
        .from('prompts')
        .select('id', { count: 'exact' })
        .eq('world_id', wid)
    if (error || !data) {
        throw Error(error.message)
    }
    return data.length
}


export const insert_prompt_history = async (wid: string, uid: string, json_content: GenPieceJson) => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('prompt_history')
        .insert({ world_id: wid, creator_id: uid, json_content: json_content })

    if (error) {
        throw error
    }
    return
}


export const fetch_prompt_history = async (uid: string) => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('prompt_history')
        .select('*')
        .eq('creator_id', uid)

    if (error || !data) {
        throw error
    }
    return data

}