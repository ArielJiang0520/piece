// worlds/[id]/pieces
import WorldPieces from "./components/WorldPieces";
import LocalNavBar from "../local-navbar";
import { getSession, getWorldDetails } from "@/app/supabase-server";

export default async function Page({ params }: { params: { id: string } }) {
    const worldDetails = await getWorldDetails(params.id)
    const { profiles, pieces, folders, ...world } = worldDetails
    const session = await getSession();
    const isOwner = session !== null && profiles !== null && session.user.id === profiles.id

    return (
        <>
            <LocalNavBar world={world} numPieces={pieces.length} />
            <div className="w-full xl:w-4/5 2xl:w-2/3 flex flex-col gap-14 px-1 py-5 lg:py-10 text-foreground font-mono">
                <WorldPieces world={world} pieces={pieces} folders={folders} isOwner={isOwner} />
            </div>
        </>
    )
}
