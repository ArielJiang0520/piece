import { Fandom } from "@/types/types.world";
import { getId } from '@/utils/helpers';
import { createClientSupabaseClient } from './helpers'

export const addNewFandom = async (values: Fandom) => {
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

export const listAllFandoms = async () => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('fandoms')
        .select('*')
        .order('name', { ascending: true })

    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }

    return data
}