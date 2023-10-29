import { getId } from "./helpers";
import { createClientSupabaseClient } from './helpers'
import { PiecePayload, Piece, TypedPiece, GeneralJson, GenPieceJson } from "@/types/types"
import { upsert_tags } from "./data-helpers";

// create a new row in pieces table (draft)
// return the created piece's ID
export const insert_piece = async (values: PiecePayload, uid: string, wid: string, is_draft: boolean): Promise<string> => {
    const supabase = createClientSupabaseClient()
    const { images, name, tags, content, settings, folder_id } = values as PiecePayload;
    const pid = `P-${getId()}`

    let piece_data = {
        id: pid,
        world_id: wid,
        creator_id: uid,
        folder_id: folder_id,

        name: name,
        tags: tags,
        piece_json: {
            content: content,
            images: images
        } as GeneralJson,
        piece_type: "original",

        nsfw: settings.NSFW,
        allow_comments: settings.allowComments
    }

    let draft_data = {
        is_draft: true, // draft
        draft_created_at: new Date().toISOString(),
        draft_modified_at: null,
    }

    // upload piece
    const { data, error } = await supabase
        .from('pieces')
        .insert(is_draft ? { ...piece_data, ...draft_data } : piece_data)
        .select('id')
        .single()

    if (error || !data) {
        console.error('Error in publishing piece' + JSON.stringify(error))
        throw Error('Error in publishing piece' + JSON.stringify(error))
    }

    // update tags
    if (!is_draft) {
        await upsert_tags(tags);
    }

    // update world modified date
    await update_world_modified_date(wid)

    return data.id
}
const get_prompt_id = async (world_id: string, prompt: string) => {
    const supabase = createClientSupabaseClient()
    const promptExists = async (world_id: string, prompt: string) => {
        const { data, error } = await supabase
            .from('prompts')
            .select('id')
            .eq('world_id', world_id)
            .eq('prompt', prompt)
            .maybeSingle()
        if (error)
            throw `Error in promptExists ${JSON.stringify(error)}`
        return data
    }
    const addNewPrompt = async (world_id: string, prompt: string) => {
        const { data, error } = await supabase
            .from('prompts')
            .insert({
                world_id: world_id,
                prompt: prompt,
                updated_at: new Date().toISOString(),
            })
            .select('id')
            .single()
        if (error || !data)
            throw `Error in addNewPrompt ${JSON.stringify(error)}`
        return data
    }
    const existedId = await promptExists(world_id, prompt)
    let promptId: null | string = null
    if (existedId) {
        promptId = existedId.id
    } else {
        promptId = (await addNewPrompt(world_id, prompt)).id
    }
    return promptId
}

export const insert_special_piece = async (input: TypedPiece, uid: string) => {
    const supabase = createClientSupabaseClient()
    const { name, world_id, type, json_content, folder_id, tags } = input as TypedPiece;
    const pid = `P-${getId()}`

    let piece_data = {
        id: pid,
        world_id: world_id,
        creator_id: uid,
        folder_id: folder_id,
        name: name,
        tags: tags,

        nsfw: false,
        allow_comments: true,

        piece_type: type,
        piece_json: json_content,
    }

    let prompt_id_data = {}
    if (type === "gen-piece") {
        try {
            const prompt = (json_content as GenPieceJson).prompt!
            const prompt_id = await get_prompt_id(world_id, prompt)
            prompt_id_data = { prompt_id: prompt_id }
        } catch (error) {
            throw Error(`Error in updating prompt_id for gen-piece. ${JSON.stringify(error)}`)
        }
    }

    // upload piece
    const { data, error } = await supabase
        .from('pieces')
        .insert({ ...piece_data, ...prompt_id_data })
        .select('id')
        .single()

    if (error || !data) {
        throw Error('Error in publishing piece' + JSON.stringify(error))
    }

    // update tags
    await upsert_tags(tags);

    // update world modified date
    await update_world_modified_date(world_id)

    return data.id
}

const update_world_modified_date = async (wid: string) => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('worlds')
        .update({ modified_at: new Date().toISOString() })
        .eq('id', wid)
        .select('id')
        .single()

    if (error || !data) {
        throw Error('Error in modifying date' + JSON.stringify(error))
    }
}
// Edit an existing row in the table. 
export const update_piece = async (values: PiecePayload, pid: string, is_draft: boolean): Promise<string> => {
    const supabase = createClientSupabaseClient()
    const { images, name, tags, content, settings, folder_id } = values as PiecePayload;

    let piece_data = {
        id: pid,
        name: name,
        tags: tags,
        folder_id: folder_id,
        piece_json: {
            content: content,
            images: images
        },
        nsfw: settings.NSFW,
        allow_comments: settings.allowComments
    }


    let modified_at_data = is_draft ? {
        draft_modified_at: new Date().toISOString(),
    } : {
        modified_at: new Date().toISOString(),
    }

    const { data, error, status } = await supabase
        .from('pieces')
        .update({ ...piece_data, ...modified_at_data })
        .eq('id', pid)
        .select('id')
        .single()

    if (error || !data) {
        throw Error(JSON.stringify(error))
    }

    return data.id
}

// Edit an existing row in the table. 
export const update_special_piece = async (values: TypedPiece, pid: string): Promise<string> => {
    const supabase = createClientSupabaseClient()
    const { name, tags, folder_id, json_content } = values as TypedPiece;

    let piece_data = {
        id: pid,
        name: name,
        tags: tags,
        folder_id: folder_id,
        piece_json: json_content,
    }

    let modified_at_data = {
        modified_at: new Date().toISOString(),
    }

    const { data, error, status } = await supabase
        .from('pieces')
        .update({ ...piece_data, ...modified_at_data })
        .eq('id', pid)
        .select('id')
        .single()

    if (error || !data) {
        throw Error(JSON.stringify(error))
    }

    return data.id
}

// Only toggle is_draft to false
export const publish_draft = async (pid: string): Promise<string> => {
    const supabase = createClientSupabaseClient()
    let piece_data = {
        is_draft: false,
        created_at: new Date().toISOString(),
        modified_at: null,
    }

    const { data, error, status } = await supabase
        .from('pieces')
        .update(piece_data)
        .eq('id', pid)
        .select('id')
        .single()

    if (error || !data) {
        throw Error(error.message)
    }

    return data.id
}

// Delete an existing row in the table
export const delete_piece = async (pid: string): Promise<number> => {
    const supabase = createClientSupabaseClient()
    const { error, status } = await supabase
        .from('pieces')
        .delete()
        .eq('id', pid)

    if (error) {
        throw Error(error.message)
    }
    return status
}

export const fetch_piece = async (pid: string) => {
    const supabase = createClientSupabaseClient();
    const { data, error } = await supabase
        .from('pieces')
        .select('*')
        .eq('id', pid)
        .single()
    if (error || !data) {
        throw Error(error.message)
    }
    return data
}

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

export const fetch_all_pieces = async (wid: string) => {
    const supabase = createClientSupabaseClient();
    const { data, error } = await supabase
        .from('pieces')
        .select('id, name')
        .eq('world_id', wid)

    if (error || !data) {
        throw Error(error.message)
    }
    return data
}

export const fetch_num_of_pieces = async (wid: string) => {
    const supabase = createClientSupabaseClient()
    const { data, error, status } = await supabase
        .from('pieces')
        .select('id', { count: 'exact' })
        .eq('world_id', wid)
    if (error || !data) {
        throw Error(error.message)
    }
    return data.length
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

export const fav_piece = async (pid: string) => {
    const supabase = createClientSupabaseClient();
    const { data, error } = await supabase
        .from('pieces')
        .update({ is_favorite: true })
        .eq('id', pid)
        .select('id')
        .single()

    if (error || !data) {
        throw Error(error.message)
    }
    return data
}

export const unfav_piece = async (pid: string) => {
    const supabase = createClientSupabaseClient();
    const { data, error } = await supabase
        .from('pieces')
        .update({ is_favorite: false })
        .eq('id', pid)
        .select('id')
        .single()

    if (error || !data) {
        throw Error(error.message)
    }
    return data
}