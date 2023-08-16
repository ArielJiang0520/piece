// worlds/[id]/pieces
import { getPiecesByWorld, getWorldDetailsById } from "@/app/supabase-server";
import PiecesMasonry from "@/components/ui/display/Piece/PiecesMasonry";

export default async function Page({ params }: { params: { id: string } }) {
    const world = await getWorldDetailsById(params.id)
    const pieces = await getPiecesByWorld(params.id)

    if (!pieces || !world)
        return <>Loading...</>

    return (
        <div className="w-full md:w-2/3 flex flex-col gap-14 px-6 py-5 lg:py-10 text-foreground font-mono">
            <PiecesMasonry pieces={pieces} displayAuthor={true} world={world} />
        </div>
    )
}
