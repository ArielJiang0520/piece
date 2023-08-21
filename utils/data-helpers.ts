import { Fandom } from "@/types/types.world";
import { getId } from '@/utils/helpers';
import { createClientSupabaseClient } from './helpers'

export const insert_fandom = async (values: Fandom) => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('fandoms')
        .insert({ ...values, id: `F-${getId()}`, created_at: new Date().toISOString() })
        .select('id')
        .single()
    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }
    return data.id
}

export const fetch_all_fandoms = async () => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('fandoms')
        .select('*')
        .order('name')

    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }
    return data
}

export const fetch_all_fandom_media_types = async () => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('fandoms_media_types')
        .select('*')
        .order('name')

    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }

    return data
}

export const fetch_all_characters = async () => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('hits', { ascending: false })

    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }

    return data
}


export async function fetch_all_tags() {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('tags')
        .select('*')

    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }

    return data
}

export async function fetch_all_tags_categories() {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('tags_categories')
        .select('*')
        .order('created_at')

    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }

    return data
}

export async function fetch_all_relationships() {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('relationships')
        .select('*')
        .order('hits', { ascending: false })

    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }

    return data
}