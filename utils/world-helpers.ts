import type { Piece, PiecePayload, WorldPayload } from "@/types/types.world"
import { postData, updateData, deleteData, getId } from "./helpers";
import { createClientSupabaseClient } from './helpers'

// create a new row in worlds table (draft)
// return the created world's ID
export const createNewWorld = async (values: WorldPayload, uid: string, is_draft: boolean): Promise<string> => {
    const supabase = createClientSupabaseClient()
    const { origin, images, title, logline, tags, description, settings } = values as WorldPayload;
    const wid = `W-${getId()}`

    let world_data = {
        id: wid,
        origin: origin,
        images: images,
        world_name: title,
        creator_id: uid,
        logline: logline,
        tags: tags,
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

    const { data, error } = await supabase
        .from('worlds')
        .insert(is_draft ? { ...world_data, ...draft_data } : world_data)
        .select('id')
        .single()

    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }

    return data.id

}

// Edit an existing row in the table. 
export const editWorld = async (values: WorldPayload, wid: string, is_draft: boolean): Promise<string> => {
    const supabase = createClientSupabaseClient()
    const { origin, images, title, logline, tags, description, settings } = values as WorldPayload;

    let world_data = {
        origin: origin,
        images: images,
        world_name: title,
        logline: logline,
        tags: tags,
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
export const publishDraft = async (wid: string): Promise<string> => {
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
export const deleteWorld = async (wid: string): Promise<number> => {
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



