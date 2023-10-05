
import { createClientSupabaseClient } from './helpers'

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

export async function fetch_genres() {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('tags')
        .select('*, category(*)')
        .eq('category.name', 'Genres')

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

export const upsert_tags = async (tags: string[]) => {
    const supabase = createClientSupabaseClient()
    const filteredTags = tags.map(tag => tag.toLocaleLowerCase())

    const { status, error } = await supabase
        .rpc('upsert_tags', { tags_list: filteredTags })

    if (error) {
        console.error('Error in upsert tags' + JSON.stringify(error) + tags)
    }

    return status
}


export const fetch_num_of_pieces = async (wid: string) => {
    const supabase = createClientSupabaseClient()
    const { data, error, status } = await supabase
        .from('pieces')
        .select('id', { count: 'exact' })
        .eq('world_id', wid)
    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }
    return data.length
}

export const fetch_num_of_subs = async (wid: string) => {
    const supabase = createClientSupabaseClient()
    const { data, error, status } = await supabase
        .from('subscriptions')
        .select('id', { count: 'exact' })
        .eq('world_id', wid)
    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }
    return data.length
}