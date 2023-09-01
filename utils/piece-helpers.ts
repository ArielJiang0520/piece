import { getId } from "./helpers";
import { createClientSupabaseClient } from './helpers'
import { PiecePayload, Piece } from "@/types/types"
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

        images: images,
        name: name,
        tags: tags,
        content: content,

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
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }

    // update tags
    if (!is_draft) {
        await upsert_tags(tags);
    }

    return data.id
}


// Edit an existing row in the table. 
export const update_piece = async (values: PiecePayload, pid: string, is_draft: boolean): Promise<string> => {
    const supabase = createClientSupabaseClient()
    const { images, name, tags, content, settings, folder_id } = values as PiecePayload;

    let piece_data = {
        id: pid,
        images: images,
        name: name,
        tags: tags,
        folder_id: folder_id,
        content: content,
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
        console.error(JSON.stringify(error))
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
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }
    return status
}
