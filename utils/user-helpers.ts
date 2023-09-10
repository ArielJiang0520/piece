import { createClientSupabaseClient } from './helpers'


export const get_profile = async (uid: string) => {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single()
    if (error || !data) {
        console.error(JSON.stringify(error))
        throw Error(error.message)
    }
    return data
}