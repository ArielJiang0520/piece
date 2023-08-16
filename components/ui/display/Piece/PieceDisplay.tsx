import type { Piece, World } from "@/types/types.world"
import { FolderIcon, BookIcon, SlashIcon } from "@/components/icon/icon"
import { FieldContentDisplay } from "@/components/ui/display/display-helpers";
import { TagsBarDisplay } from "@/components/ui/display/tags-display-helpers";
import Link from "next/link";
import { PieceAuthorDisplay } from "@/components/ui/display/user-display-helpers";
import type { User } from "@supabase/supabase-js";
import { ImagesDisplayRow } from "@/components/ui/image/ImagesDisplayRow";

const PieceMetadataDisplay = ({ piece, world }: { piece: Piece, world: World }) => {
    return (
        <div className="flex flex-row w-full  justify-start items-center text-xs text-left text-foreground">
            <Link href={`/world/${world.id}`}>
                <div className="cursor-pointer flex flex-row items-center justify-start space-x-1 w-64">
                    <BookIcon className="flex-shrink-0" />
                    <div className="overflow-hidden whitespace-nowrap overflow-ellipsis">{world.world_name}</div>
                </div>
            </Link>
            {/* <SlashIcon className="flex-shrink-0" /> */}
            {/* <Link href={`/world/${world.id}`}>
                <div className="cursor-pointer flex flex-row items-center justify-start space-x-1 w-28">
                    <FolderIcon className="flex-shrink-0" />
                    <span className="overflow-hidden  whitespace-nowrap overflow-ellipsis">{world.world_name}</span>
                </div>
            </Link> */}
        </div>

    )
}


interface PieceDisplayProps {
    piece: Piece;
    world: World;
    user: User;
    preview?: boolean
}
export default function PieceDisplay({ piece, world, user, preview = false }: PieceDisplayProps) {
    return (
        <div className='flex flex-col space-y-3 items-start'>
            <div id="title-group" className='w-full flex flex-row flex-wrap items-center justify-start'>
                {/* <div className="font-serif text-4xl font-semibold">{piece.title}</div> */}
                <FieldContentDisplay content={piece.title} textSize="text-4xl" bold="font-semibold" />
            </div>

            <div id="metadata-group" className="mt-2 w-full flex flex-col" >
                <PieceMetadataDisplay piece={piece} world={world} />
            </div>

            <div id="author-group" className="w-full flex flex-col" >
                <PieceAuthorDisplay author={user} piece={piece} />
            </div>

            <div id='image-display' className="flex flex-row space-x-2 overflow-x-auto">
                <ImagesDisplayRow bucket="world" dimension={{ height: "h-80", width: "w-80" }} paths={piece.images} />
            </div>

            <div id='logline-display' className="w-full flex flex-col">

                <FieldContentDisplay content={piece.logline} textSize="text-base" bold="font-semibold" />
            </div>

            <div id="content-group" className='w-full flex flex-row flex-wrap items-center justify-start whitespace-pre-line'>
                <FieldContentDisplay content={piece.content} textSize="text-base" bold="font-normal" />
            </div>

            <div id="tags-group" className='w-full flex flex-col'>
                <TagsBarDisplay tags={piece.tags} preview={preview} />
            </div>
        </div>
    )
}