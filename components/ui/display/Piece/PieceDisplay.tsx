'use client'
import type { Piece, Profile, World } from "@/types/types"
import { EmptyHeartIcon, WorldIcon, CalendarIcon, BookIcon } from "@/components/icon/icon"
import { FieldContentDisplay, FieldTitleDisplay } from "@/components/ui/display/display-helpers";
import { TagsBarDisplay } from "@/components/ui/input/tags-helpers";
import Link from "next/link";
import { PieceAuthorDisplay } from "@/components/ui/display/user-display-helpers";
import type { User } from "@supabase/supabase-js";
import { ImagesDisplayRow } from "@/components/ui/image/ImagesDisplayRow";
import { formatTimestamp } from "@/utils/helpers";
import { IconButtonTiny } from "@/components/ui/button/button-helpers";

const PieceMetadataDisplay = ({ piece, world }: { piece: Piece, world: World }) => {
    return (
        <div className="flex flex-row w-full  justify-start items-center text-sm text-left font-medium">

            <div className="cursor-pointer flex flex-row items-center justify-start space-x-1 w-64 hover:text-brand">
                <BookIcon className="flex-shrink-0" />
                <Link href={`/worlds/${world.id}`}>
                    <div className="overflow-hidden whitespace-nowrap overflow-ellipsis ">{world.name}</div>
                </Link>
            </div>
            {/* <SlashIcon className="flex-shrink-0" /> */}
            {/* <Link href={`/worlds/${world.id}`}>
                <div className="cursor-pointer flex flex-row items-center justify-start space-x-1 w-28">
                    <FolderIcon className="flex-shrink-0" />
                    <span className="overflow-hidden  whitespace-nowrap overflow-ellipsis">{world.name}</span>
                </div>
            </Link> */}
        </div>

    )
}


interface PieceDisplayProps {
    piece: Piece;
    world: World;
    author: Profile;
    preview?: boolean
}
export default function PieceDisplay({ piece, world, author, preview = false }: PieceDisplayProps) {
    return (
        <div className='flex flex-col space-y-3 items-start'>


            <div id="title-group" className='w-full flex flex-row flex-wrap items-center justify-start'>
                {/* <div className="font-serif text-4xl font-semibold">{piece.title}</div> */}
                <FieldContentDisplay content={piece.name} textSize="text-4xl" bold="font-semibold" />
            </div>


            <div id="metadata-group" className="mt-2 w-full flex flex-col" >
                <PieceMetadataDisplay piece={piece} world={world} />
            </div>



            <div id="author-group" className="w-full flex flex-col max-w-2xl">
                <Link href={`/profiles/${author.id}`}>
                    <PieceAuthorDisplay author={author} />
                </Link>
            </div>


            <div id='image-display' className="flex flex-row space-x-2 overflow-x-auto">
                <ImagesDisplayRow bucket="world" dimension={{ height: "h-80", width: "w-80" }} paths={piece.images} />
            </div>

            <div id="content-group" className='w-full flex flex-row flex-wrap items-center justify-start whitespace-pre-line'>
                <FieldContentDisplay content={piece.content} textSize="text-base" bold="font-normal" />
            </div>

            <div id="tags-group" className='w-full flex flex-col'>
                <FieldTitleDisplay label={"tags:"} textSize="text-sm" />
                <TagsBarDisplay tags={piece.tags} preview={preview} />
            </div>


            <div className='flex flex-row text-base justify-between items-center  w-full'>
                <IconButtonTiny icon={<EmptyHeartIcon className="text-foreground/50" />} title={"0"} />
                <div className="flex flex-row text-xs items-center space-x-1 ">
                    <CalendarIcon />
                    <span>Created on {formatTimestamp(piece.created_at, true)}</span>
                </div>
            </div>

            <div className="hpx border-t w-full my-2">

            </div>


        </div >
    )
}