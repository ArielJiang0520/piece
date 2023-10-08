'use client'
import type { WorldMetadata } from "@/app/supabase-server";
import { IconButtonMid, CopyableID } from "@/components/ui/button/button-helpers";
import { StarIcon, AtomIcon, Rating18PlusIcon, BookIcon, CalendarIcon, EyeIcon, EyeOffIcon, RatingGeneralIcon, HandShakeIcon, HandShakeSlashIcon, LightBulbIcon, LightBulbOffIcon, PencilIcon, SlashIcon } from "@/components/icon/icon"
import { FieldContentDisplay, FieldTitleDisplay } from "@/components/ui/display/display-helpers";
import { TagsBarSmallDisplay, TagsBarDisplay } from "@/components/ui/input/tags-helpers";
import { AccordionDisplay } from './AccordionDisplay';
import { WorldDescriptionSection } from "@/types/types";
import { formatTimestamp, getDistanceToNow } from "@/utils/helpers";
import { ImagesDisplayRow } from "@/components/ui/image/ImagesDisplayRow";
import Link from "next/link";
import 'react-loading-skeleton/dist/skeleton.css'
import { AuthorDisplay } from "../user-display-helpers";
import { useSupabase } from "@/app/supabase-provider";


const WorldPrivacyDisplay = ({ world }: { world: WorldMetadata }) => {

    return (
        <>
            <div className='w-full grid grid-cols-2 grid-flex-row gap-3 text-left text-sm text-foreground/70 border p-5'>
                <div className="flex flex-row items-center justify-start whitespace-nowrap">
                    <div className='flex flex-row justify-start items-center space-x-1'>
                        {world.is_public ? <EyeIcon /> : <EyeOffIcon />}
                        {world.is_public ? <span>Public World</span> : <span>Private World</span>}
                    </div>
                </div>
                <div className="flex flex-row items-center justify-start whitespace-nowrap">
                    <div className='flex flex-row justify-start items-center space-x-1'>
                        {world.nsfw ? <Rating18PlusIcon /> : <RatingGeneralIcon />}
                        {world.nsfw ? <span>NSFW Content</span> : <span>General Audiences</span>}
                    </div>
                </div>
                <div className="flex flex-row items-center justify-start whitespace-nowrap">
                    <div className='flex flex-row justify-start items-center space-x-1'>
                        {world.allow_contribution ? <HandShakeIcon /> : <HandShakeSlashIcon />}
                        {world.allow_contribution ? <span>Allow Contribution</span> : <span>No Contribution</span>}
                    </div>
                </div>
                <div className="flex flex-row items-center justify-start whitespace-nowrap">
                    <div className='flex flex-row justify-start items-center space-x-1'>
                        {world.allow_suggestion ? <LightBulbIcon /> : <LightBulbOffIcon />}
                        {world.allow_suggestion ? <span>Open for Request</span> : <span>Request Disabled</span>}
                    </div>
                </div>
            </div>
        </>
    )
}


interface WorldDisplayProps {
    world: WorldMetadata;
    isOwner?: boolean;
    preview?: boolean;
}

export default function WorldDisplay({ world, isOwner = false, preview = false }: WorldDisplayProps) {
    const { tagMap } = useSupabase();
    return (

        <div className='flex flex-col space-y-3 items-start text-foreground'>

            {preview ? null : <CopyableID id_string="World ID" id={world.id} />}

            {!preview && <div id="button-group" className='w-full flex flex-row justify-between items-center'>
                <div className='flex flex-row space-x-1 text-sm md:text-base'>
                    <IconButtonMid icon={<StarIcon />} title={`${world.subscriptions[0].count} Subscribers`} />
                    <Link href={{ pathname: '/create-a-piece', query: { world_id: world.id } }} >
                        <IconButtonMid icon={<AtomIcon />} title={"Create a Piece"} />
                    </Link>
                </div>
                {isOwner && <div className='flex flex-row'>
                    <Link href={{ pathname: '/create-a-world', query: { edit_id: world.id } }} >
                        <IconButtonMid icon={<PencilIcon />} />
                    </Link>
                </div>}
            </div>}

            <div id="title-group" className='w-full flex flex-row flex-wrap items-center justify-start'>
                <FieldContentDisplay content={world.name} textSize="text-4xl" bold="font-bold" />
            </div>

            <div id="gren-date-group" className="grid md:flex md:space-x-3 space-y-1 text-sm text-foreground/80">
                <div id="genre" className='flex flex-row justify-start items-center space-x-1'>
                    <BookIcon />
                    <div className='flex flex-row justify-start items-center capitalize font-medium'>
                        <span>{tagMap[world.primary_genre!]}</span>
                        <SlashIcon />
                        <span>{tagMap[world.secondary_genre!]}</span>
                    </div>
                </div>
                <div id="date" className='flex flex-row justify-start items-center space-x-1'>
                    <CalendarIcon />
                    {world.modified_at ?
                        <span>{`Updated ${getDistanceToNow(world.modified_at)}`}</span>
                        : <span>{`Created ${getDistanceToNow(world.created_at)}`}</span>}
                </div>
            </div>

            {world.profiles && !preview && <div id="author-group" className="w-full flex flex-col">
                <AuthorDisplay author={world.profiles} bannerContent="World Creator" />
            </div>}

            <div id='image-display' className="flex flex-row space-x-2 overflow-x-auto">
                <ImagesDisplayRow bucket="world" paths={world.images} dimension={{ height: "h-96", width: "w-96" }} popup={true} />
            </div>

            <div id="logline-group" className='w-full flex flex-col'>
                <FieldContentDisplay content={world.logline} textSize="text-base" bold="font-normal" />
            </div>

            <div id="tags-group" className='w-full flex flex-col'>
                <TagsBarDisplay tags={world.tags} preview={preview} scroll={false} />
            </div>



            <div className='w-full max-w-2xl flex flex-col'>
                <WorldPrivacyDisplay world={world} />
            </div>

            <div id="description-group" className='flex flex-col'>
                <AccordionDisplay sections={world.description as WorldDescriptionSection[]} preview={preview} />
            </div>


        </div>
    )
}