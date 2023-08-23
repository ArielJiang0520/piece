'use client'
import type { Piece, Profile, World } from "@/types/types"
import { FolderIcon, WorldIcon, SlashIcon } from "@/components/icon/icon"
import { FieldContentDisplay } from "@/components/ui/display/display-helpers";
import { TagsBarDisplay } from "@/components/ui/input/tags-helpers";
import Link from "next/link";
import { PieceAuthorDisplay } from "@/components/ui/display/user-display-helpers";
import type { User } from "@supabase/supabase-js";
import { ImagesDisplayRow } from "@/components/ui/image/ImagesDisplayRow";
import PeekWorld from "../World/PeekWorld";

const PieceMetadataDisplay = ({ piece, world }: { piece: Piece, world: World }) => {
    return (
        <div className="flex flex-row w-full  justify-start items-center text-sm text-left font-semibold">

            <div className="cursor-pointer flex flex-row items-center justify-start space-x-1 w-64 hover:text-brand">
                <WorldIcon className="flex-shrink-0" />
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



            <div id="author-group" className="w-full flex flex-col">
                <Link href={`/profiles/${author.id}`}>
                    <PieceAuthorDisplay author={author} piece={piece} />
                </Link>
            </div>

            <div id='image-display' className="flex flex-row space-x-2 overflow-x-auto">
                <ImagesDisplayRow bucket="world" dimension={{ height: "h-80", width: "w-80" }} paths={piece.images} />
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