// worlds/[id]/pieces
import { getPiecesByWorld, getWorldDetailsById } from "@/app/supabase-server";
import WorldPieces from "./components/WorldPieces";
import LocalNavBar from "../local-navbar";


export default async function Page({ params }: { params: { id: string } }) {
    const world = await getWorldDetailsById(params.id)
    const pieces = await getPiecesByWorld(params.id)

    if (!pieces || !world)
        return <>Loading...</>

    return (
        <>
            <LocalNavBar world={world} />
            <div className="w-full md:w-2/3 flex flex-col gap-14 px-1 py-5 lg:py-10 text-foreground font-mono">
                <WorldPieces world={world} pieces={pieces} />
            </div>
        </>
    )
}
