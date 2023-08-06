import type { World } from "@/types/types.world"
import { IconButton } from "@/components/ui/button/IconButton";
import { StarIcon, AtomIcon, Rating18PlusIcon, BookIcon, CalendarIcon } from "@/components/icon/icon"
import { FieldContentDisplay } from "@/components/ui/display/display-helpers";
import { TagsBarDisplay } from "@/components/ui/display/tags-display-helpers";
import { AccordionDisplay } from './AccordionDisplay';
import { WorldDescriptionSection } from "@/types/types.world";
import { formatTimestamp } from "@/utils/helpers";
import { ImagesDisplayRow } from "@/components/ui/image/ImagesDisplayRow";
import Link from "next/link";

const WorldMetadataDisplay = ({ world }: { world: World }) => {
    return (
        <div className='w-full flex flex-row text-right text-xs text-foreground/80 space-x-3'>
            <div className="">
                <div className='flex flex-row justify-start items-center space-x-1'>
                    <BookIcon />
                    <span>{world.origin ? origin : "Original World"}</span>
                </div>
            </div>
            <div className="">
                <div className='flex flex-row justify-start items-center space-x-1'>
                    <CalendarIcon />
                    <span>{world.modified_at ? `Updated on ${formatTimestamp(world.modified_at, true)}` : `Created on ${formatTimestamp(world.created_at, true)}`}</span>
                </div>
            </div>
        </div>
    )
}

interface WorldDisplayProps {
    world: World;
    preview?: boolean
}

export default function WorldDisplay({ world, preview = false }: WorldDisplayProps) {
    return (
        <div className='flex flex-col space-y-3 items-start'>
            <div id="button-group" className='w-full flex flex-row justify-between items-center'>
                {preview ? null : <div className='flex flex-row space-x-2'>
                    <IconButton icon={<StarIcon />} title={"124"} />
                    <Link href={{ pathname: '/create-a-piece', query: { id: world.id } }} >
                        <IconButton icon={<AtomIcon />} title={"Create a Piece"} />
                    </Link>
                </div>}

                <div className='flex flex-row'>
                    {world.nsfw ? <Rating18PlusIcon className="w-10 h-10 text-left text-red-500" /> : null}
                </div>
            </div>

            <div id="title-group" className='w-full flex flex-row flex-wrap items-center justify-start'>
                <FieldContentDisplay content={world.world_name} textSize="text-4xl" bold="font-bold" />

            </div>

            <div id="metadata-group" className="w-full flex flex-col" >
                <WorldMetadataDisplay world={world} />
            </div>

            <div id='image-display' className="flex flex-row space-x-2 overflow-x-auto">
                <ImagesDisplayRow paths={world.images} dimension={{ height: "h-80", width: "w-80" }} />
            </div>

            <div id="logline-group" className='w-full flex flex-col'>
                <FieldContentDisplay content={world.logline} textSize="text-base" bold="font-normal" />
            </div>
            <div id="tags-group" className='w-full flex flex-col'>
                <TagsBarDisplay tags={world.tags} preview={preview} />
            </div>
            <div id="description-group" className='w-full flex flex-col'>
                <AccordionDisplay sections={world.description as WorldDescriptionSection[]} />
            </div>
            <div id="authors-group" className='w-full flex flex-col'>

            </div>

        </div>
    )
}