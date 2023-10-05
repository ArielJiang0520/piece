// worlds/[id]/pieces
import WorldPieces from "./components/WorldPieces";
import LocalNavBar from "../local-navbar";
import { getWorldDetails } from "@/app/supabase-server";

export default async function Page({ params }: { params: { id: string } }) {
    const worldDetails = await getWorldDetails(params.id)
    const { profiles, pieces, folders, ...world } = worldDetails

    return (
        <>
            <LocalNavBar world={world} numPieces={pieces.length} />
            <div className="w-full md:w-2/3 flex flex-col gap-14 px-1 py-5 lg:py-10 text-foreground font-mono">
                <WorldPieces world={world} creator={profiles} pieces={pieces} folders={folders} />
            </div>
        </>
    )
}
