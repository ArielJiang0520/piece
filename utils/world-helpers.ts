import type { World, WorldDescriptionSection, WorldPayload } from "@/types/types"
import { getId } from "./helpers";
import { createClientSupabaseClient } from './helpers'
import { upsert_tags } from "./data-helpers";
import { cleanTags } from "./helpers";

// create a new row in worlds table (draft)
// return the created world's ID
export const insert_world = async (values: WorldPayload, uid: string, is_draft: boolean): Promise<string> => {
    const supabase = createClientSupabaseClient()
    const { images, name, tags: rawTags, genre1, genre2, logline, description, settings, progress } = values as WorldPayload;
    const tags = cleanTags(rawTags)

    const wid = `W-${getId()}`

    let world_data = {
        id: wid,
        images: images,
        name: name,
        tags: tags,
        primary_genre: genre1,
        secondary_genre: genre2,
        creator_id: uid,
        logline: logline,
        description: description,
        is_public: settings.public,
        nsfw: settings.NSFW,
        allow_contribution: settings.allowContribution,
        allow_suggestion: settings.allowSuggestion,
        progress: progress
    }

    let draft_data = {
        is_draft: true, // draft
        draft_created_at: new Date().toISOString(),
        draft_modified_at: null,
    }

    // upload world
    const { data, error } = await supabase
        .from('worlds')
        .insert(is_draft ? { ...world_data, ...draft_data } : world_data)
        .select('id')
        .single()

    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }


    if (!is_draft) {
        // update tags
        await upsert_tags(tags);
    }

    return data.id
}


// Edit an existing row in the table.
// TODO: upsert new tags/characters? 
export const update_world = async (values: WorldPayload, wid: string, is_draft: boolean): Promise<string> => {
    const supabase = createClientSupabaseClient()
    const { images, name, tags: rawTags, genre1, genre2, logline, description, settings, progress } = values as WorldPayload;
    const tags = cleanTags(rawTags)

    let world_data = {
        images: images,
        name: name,
        logline: logline,
        tags: tags,
        primary_genre: genre1,
        secondary_genre: genre2,
        description: description,
        is_public: settings.public,
        nsfw: settings.NSFW,
        allow_contribution: settings.allowContribution,
        allow_suggestion: settings.allowSuggestion,
        progress: progress
    }

    let modified_at_data = is_draft ? {
        draft_modified_at: new Date().toISOString(),
    } : {
        modified_at: new Date().toISOString(),
    }

    const { data, error, status } = await supabase
        .from('worlds')
        .update({ ...world_data, ...modified_at_data })
        .eq('id', wid)
        .select('id')
        .single()

    if (error || !data) {
        throw Error(error.message)
    }
    return data.id
}

// Only toggle is_draft to false
export const publish_draft = async (wid: string): Promise<string> => {
    const supabase = createClientSupabaseClient()
    let world_data = {
        is_draft: false,
        created_at: new Date().toISOString(),
        modified_at: null,
    }

    const { data, error, status } = await supabase
        .from('worlds')
        .update(world_data)
        .eq('id', wid)
        .select('id')
        .single()

    if (error || !data) {
        throw Error(error.message)
    }

    return data.id
}

// Delete an existing row in the table
export const delete_world = async (wid: string, world_origin: null | string = null): Promise<number> => {
    const supabase = createClientSupabaseClient()
    const { error, status } = await supabase
        .from('worlds')
        .delete()
        .eq('id', wid)

    if (error) {
        throw Error(error.message)
    }
    return status
}

export const fetch_world = async (wid: string) => {
    const supabase = createClientSupabaseClient()
    const { error, data } = await supabase
        .from('worlds')
        .select('*')
        .eq('id', wid)
    if (error || !data) {
        throw Error(error.message)
    }
    return data
}

export const fetch_all_worlds = async (uid: string) => {
    const supabase = createClientSupabaseClient()
    const { error, data } = await supabase
        .from('worlds')
        .select('id, name, modified_at')
        .eq('creator_id', uid)
        .eq('is_draft', false)
        .order('modified_at', { ascending: false })

    if (error || !data) {
        throw Error(error.message)
    }
    return data
}

export function getCharDict(world: World) {
    let charList = [] as string[]
    for (let section of (world.description as WorldDescriptionSection[])) {
        for (let card of section.sectionCards) {
            if (card.isCharacterCard)
                charList.push(card.cardTitle)
        }
    }

    return charList.map((char, idx) => { return { id: idx, name: char } })
}

