
import { Modifier } from '@/types/types'
import { createClientSupabaseClient } from './helpers'

export async function fetch_all_modifiers() {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('modifiers')
        .select('*')

    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }

    return data
}


export const insert_modifier = async (input: Modifier, uid: string) => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('modifiers')
        .insert({ creator_id: uid, name: input.name, description: input.description, content: input.content })

    if (error) {
        throw error
    }
    return
}
