import { getId } from "./helpers";
import { createClientSupabaseClient } from './helpers'
import { PiecePayload, Piece, TypedPiece, GeneralJson } from "@/types/types"
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

    // upload piece
    const { data, error } = await supabase
        .from('pieces')
        .insert(piece_data)
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
        console.error('Error in modifying date' + JSON.stringify(error))
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
        console.error(JSON.stringify(error))
        throw Error(error.message)
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
        console.error(JSON.stringify(error))
        throw Error(error.message)
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
