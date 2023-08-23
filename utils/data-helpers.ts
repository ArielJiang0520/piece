import { Fandom } from "@/types/types";
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

export async function fetch_characters_of_fandom(fandom_id: string) {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('fandom_id', fandom_id)
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

export async function fetch_relationships_of_fandom(fandom_id: string) {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('relationships')
        .select('*')
        .eq('fandom_id', fandom_id)
        .order('hits', { ascending: false })

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
        console.error(JSON.stringify(error))
    }

    return status
}


export const upsert_characters = async (characters: string[], fandom_id: string) => {
    const supabase = createClientSupabaseClient()
    const filteredCharacters = characters.map(char => char.toLocaleLowerCase())

    const { status, error } = await supabase
        .rpc('upsert_characters', { character_names: filteredCharacters, p_fandom_id: fandom_id })

    if (error) {
        console.error(JSON.stringify(error))
    }

    return status
}


export const upsert_relationships = async (relationships: string[], fandom_id: string) => {
    const supabase = createClientSupabaseClient()
    const filteredShips = relationships.map(ship => ship.toLocaleLowerCase())

    const { status, error } = await supabase
        .rpc('upsert_relationships', { relationship_names: filteredShips, p_fandom_id: fandom_id })

    if (error) {
        console.error(JSON.stringify(error))
    }

    return status
}


