import { getPiecesByUser } from "@/app/supabase-server";
import PieceCard from "@/components/ui/display/Piece/PieceCard";

export default async function Page({ params }: { params: { id: string } }) {
    const pieces = await getPiecesByUser(params.id)

    if (!pieces)
        return <>Loading...</>

    return (
        <div className="w-full md:w-2/3 flex flex-col gap-14 px-2 py-5 lg:py-10 text-foreground font-mono">
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2`}>
                <div className="space-y-2 flex-1">
                    {pieces
                        .sort((a, b) => {
                            const dateA = a.created_at;
                            const dateB = b.created_at;
                            // For descending order (latest to oldest)
                            return dateB.localeCompare(dateA);
                        })
                        .filter((_, index) => index % 2 === 0)
                        .map((piece) => (
                            <PieceCard key={piece.id} piece={piece} />
                        ))}
                </div>
                <div className="space-y-2 flex-1">
                    {pieces
                        .sort((a, b) => {
                            const dateA = a.created_at;
                            const dateB = b.created_at;
                            // For descending order (latest to oldest)
                            return dateB.localeCompare(dateA);
                        })
                        .filter((_, index) => index % 2 !== 0)
                        .map((piece) => (
                            <PieceCard key={piece.id} piece={piece} />
                        ))}
                </div>
            </div>
        </div>
    )
}
