import { getPieceDetailsIncludeWorld, getSession } from "@/app/supabase-server";
import PieceDisplay from "@/components/ui/display/Piece/PieceDisplay";
import LocalNavBar from "./local-navbar";

export default async function Page({ params }: { params: { id: string } }) {
    const { worlds: world, profiles: profile, folders: folder, ...piece } = await getPieceDetailsIncludeWorld(params.id)
    const session = await getSession()

    if (!world || !profile || !piece) {
        return <>Loading...</>
    }

    const isOwner = session !== null && session.user.id === piece.creator_id

    return (
        <>
            <LocalNavBar piece={piece} world={world} />
            <div className="w-full md:w-2/3 xl:w-1/2 flex flex-col gap-4 px-5 py-5 lg:py-10 text-foreground font-mono">
                <PieceDisplay isOwner={isOwner} piece={piece} world={world} folder={folder} author={profile} />
            </div>
        </>
    )
}
