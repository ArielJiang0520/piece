import type { JoinedWorldAll, WorldPayload } from "@/types/types"
import { getId } from "./helpers";
import { createClientSupabaseClient } from './helpers'
import { upsert_characters, upsert_relationships, upsert_tags } from "./data-helpers";
import { cleanTags } from "./helpers";

// create a new row in worlds table (draft)
// return the created world's ID
export const insert_world = async (values: WorldPayload, uid: string, is_draft: boolean): Promise<string> => {
    const supabase = createClientSupabaseClient()
    const { origin, images, name, characters: rawCharacters, tags: rawTags, relationships: rawRelationships, relationship_types, logline, description, settings } = values as WorldPayload;
    const tags = cleanTags(rawTags)
    const characters = cleanTags(rawCharacters)
    const relationships = cleanTags(rawRelationships)

    const wid = `W-${getId()}`

    let world_data = {
        id: wid,
        origin: origin,
        images: images,
        name: name,
        characters: characters,
        tags: tags,
        relationship_types: relationship_types,
        relationships: relationships,
        creator_id: uid,
        logline: logline,
        description: description,
        is_public: settings.public,
        nsfw: settings.NSFW,
        allow_contribution: settings.allowContribution,
        allow_suggestion: settings.allowSuggestion,
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
        // increase number of worlds for fandom
        // TODO

        // update tags
        await upsert_tags(tags);

        if (origin) {
            await upsert_characters(characters, origin);
            await upsert_relationships(relationships, origin);
        }
    }

    return data.id
}


// Edit an existing row in the table.
// TODO: upsert new tags/characters? 
export const update_world = async (values: WorldPayload, wid: string, is_draft: boolean): Promise<string> => {
    const supabase = createClientSupabaseClient()
    const { origin, images, name, characters: rawCharacters, tags: rawTags, relationships: rawRelationships, relationship_types, logline, description, settings } = values as WorldPayload;
    const tags = cleanTags(rawTags)
    const characters = cleanTags(rawCharacters)
    const relationships = cleanTags(rawRelationships)


    let world_data = {
        origin: origin,
        images: images,
        name: name,
        logline: logline,
        tags: tags,
        relationship_types: relationship_types,
        relationships: relationships,
        characters: characters,
        description: description,
        is_public: settings.public,
        nsfw: settings.NSFW,
        allow_contribution: settings.allowContribution,
        allow_suggestion: settings.allowSuggestion,

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
        console.error(JSON.stringify(error))
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
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }

    return data.id
}

// Delete an existing row in the table
export const delete_world = async (wid: string): Promise<number> => {
    const supabase = createClientSupabaseClient()
    const { error, status } = await supabase
        .from('worlds')
        .delete()
        .eq('id', wid)

    if (error) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
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
