import { createClientSupabaseClient } from './helpers'

export async function insert_folder(folder_name: string, wid: string) {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('folders')
        .insert({ name: folder_name, world_id: wid })
        .select('id')
        .single()
    if (!data || error) {
        throw Error(JSON.stringify(error))
    }
    return data
}

export async function update_piece_folder(pid: string, new_folder_id: string) {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('pieces')
        .update({ folder_id: new_folder_id })
        .eq('id', pid)
        .select('id')
        .single()

    if (!data || error) {
        throw Error(JSON.stringify(error))
    }
    return data
}

export async function update_folder_name(id: string, new_name: string) {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('folders')
        .update({ name: new_name })
        .eq('id', id)
        .select('id')
        .single()

    if (!data || error) {
        throw Error(JSON.stringify(error))
    }
    return data
}

export async function delete_folder(id: string) {
    const supabase = createClientSupabaseClient()
    const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id)
    if (error) {
        throw Error(JSON.stringify(error))
    }
    return 0
}


export async function fetch_all_folders(wid: string) {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('world_id', wid)
        .order('created_at')

    if (!data || error) {

        throw Error(JSON.stringify(error))

    }
    return data
}