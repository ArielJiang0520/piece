import { getPieceById } from "@/app/supabase-server";
import PieceDisplay from "@/components/ui/display/Piece/PieceDisplay";
import LocalNavBar from "./local-navbar";
import { BackIcon, PencilIcon } from "@/components/icon/icon";
import Link from "next/link";
import { IconButtonMid, IconButtonSmall } from "@/components/ui/button/button-helpers";

export default async function Page({ params }: { params: { id: string } }) {
    const { worlds: world, profiles: profile, ...piece } = await getPieceById(params.id)


    if (!world || !profile || !piece) {
        return <>Loading...</>
    }


    return (
        <>
            <LocalNavBar piece={piece} world={world} />
            <div className="w-full md:w-2/3 xl:w-1/2 flex flex-col gap-4 px-5 py-5 lg:py-10 text-foreground font-mono">
                <div className="flex flex-row justify-between">
                    <Link href={`/worlds/${world.id}/pieces`}>
                        <div className="flex flex-row justify-start items-center space-x-2 text-sm font-medium text-foreground/50 hover:text-foreground">
                            <BackIcon />
                            <div>
                                All pieces in this world
                            </div>
                        </div>
                    </Link>
                    <Link href={`/create-a-piece?edit_id=${piece.id}`}>
                        <IconButtonMid icon={<PencilIcon />} title={'Edit'} />
                    </Link>
                </div>
                <PieceDisplay piece={piece} world={world} author={profile} />
            </div>
        </>
    )
}
