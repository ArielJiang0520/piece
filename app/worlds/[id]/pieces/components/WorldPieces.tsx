'use client'
import { Piece, Profile, Folder, DefaultFolder, World } from "@/types/types";
import { FolderCount, PieceDetails } from "@/app/supabase-server";
import ViewByFolder from "./ViewByFolder";
import { useSearchParams } from "next/navigation";

interface WorldPiecesProps {
    world: World,
    pieces: PieceDetails[],
    folders: FolderCount[],
    isOwner: boolean
}
export function WorldPieces({ pieces, world, folders, isOwner }: WorldPiecesProps) {
    const searchParams = useSearchParams();

    return <div className="w-full flex flex-col  font-mono">

        <ViewByFolder world={world} pieces={pieces} folders={folders} isOwner={isOwner} />
    </div>
}