import { getSession } from "@/app/supabase-server";
import MyPieces from "./components/MyPieces";
import { createServerSupabaseClient } from "@/app/supabase-server";

async function getPiecesByUser(id: string, isOwner: boolean) {
    const supabase = createServerSupabaseClient();
    try {
        let query = supabase
            .from('pieces')
            .select('*, worlds(world_name)')
            .eq('creator_id', id)

        if (!isOwner) { query = query.eq('worlds.is_public', true); }

        const { data, error } = await query

        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function getWorldsByUser(id: string, isOwner: boolean) {
    const supabase = createServerSupabaseClient();
    try {
        let query = supabase
            .from('worlds')
            .select()
            .eq('creator_id', id)
            .eq('is_draft', false)

        if (!isOwner) { query = query.eq('is_public', true) }

        const { data, error } = await query
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}


export default async function Page({ params }: { params: { id: string } }) {
    const session = await getSession()
    const isOwner = session !== null && session.user.id === params.id
    const pieces = await getPiecesByUser(params.id, isOwner)
    const worlds = await getWorldsByUser(params.id, isOwner)

    if (!pieces || !worlds)
        return <>Loading...</>

    return (
        <div className="w-full md:w-2/3 flex flex-col gap-14 px-2 py-5 lg:py-10 text-foreground font-mono">
            <MyPieces pieces={pieces} worlds={worlds} />
        </div>
    )
}
