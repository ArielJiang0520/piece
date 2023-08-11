import { getPiecesByUser, getSession, getWorldsByUser } from "@/app/supabase-server";
import MyPieces from "./components/MyPieces";

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
