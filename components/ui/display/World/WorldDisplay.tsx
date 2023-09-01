'use client'
import type { Subscription, World, Fandom } from "@/types/types"
import { IconButtonMid, CopyableID } from "@/components/ui/button/button-helpers";
import { StarIcon, AtomIcon, Rating18PlusIcon, BookIcon, CalendarIcon, EyeIcon, EyeOffIcon, RatingGeneralIcon, HandShakeIcon, HandShakeSlashIcon, LightBulbIcon, LightBulbOffIcon, PencilIcon } from "@/components/icon/icon"
import { FieldContentDisplay, FieldTitleDisplay } from "@/components/ui/display/display-helpers";
import { TagsBarSmallDisplay, TagsBarDisplay } from "@/components/ui/input/tags-helpers";
import { AccordionDisplay } from './AccordionDisplay';
import { WorldDescriptionSection } from "@/types/types";
import { formatTimestamp } from "@/utils/helpers";
import { ImagesDisplayRow } from "@/components/ui/image/ImagesDisplayRow";
import Link from "next/link";
import 'react-loading-skeleton/dist/skeleton.css'
import { get_subscribers, sub_to_world } from "@/utils/stats-helpers";
import { useEffect, useState } from "react";
import { fetch_all_fandoms } from "@/utils/data-helpers";
import { fetch_num_of_pieces, fetch_num_of_subs } from "@/utils/world-helpers";

const WorldMetadataDisplay = ({ world }: { world: World }) => {
    const [fandoms, setFandoms] = useState<Fandom[]>([])
    const worldOrigin = world.origin ? fandoms.find(item => item.id === world.origin)?.name || null : "Original World"

    useEffect(() => {
        const fetchFandoms = async () => setFandoms(await fetch_all_fandoms());
        if (world.origin)
            fetchFandoms()
    }, [])

    return (
        <>
            <div className='w-full flex flex-row text-right text-xs text-foreground/80 space-x-3'>
                <div className="">
                    <div className='flex flex-row justify-start items-center space-x-1'>
                        <BookIcon />
                        <span>{worldOrigin}</span>
                    </div>
                </div>
                <div className="">
                    <div className='flex flex-row justify-start items-center space-x-1'>
                        <CalendarIcon />
                        <span>{`Created on ${formatTimestamp(world.created_at, true)}`}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

const WorldPrivacyDisplay = ({ world }: { world: World }) => {
    return (
        <>
            <div className='w-full grid grid-cols-2 grid-flex-row gap-3 text-left text-sm text-foreground/70 border p-5'>
                <div className="flex flex-row items-center justify-start">
                    <div className='flex flex-row justify-start items-center space-x-1'>
                        {world.is_public ? <EyeIcon /> : <EyeOffIcon />}
                        {world.is_public ? <span>Public World</span> : <span>Private World</span>}
                    </div>
                </div>
                <div className="flex flex-row items-center justify-start">
                    <div className='flex flex-row justify-start items-center space-x-1'>
                        {world.nsfw ? <Rating18PlusIcon /> : <RatingGeneralIcon />}
                        {world.nsfw ? <span>Contains NSFW Content</span> : <span>General Audiences</span>}
                    </div>
                </div>
                <div className="flex flex-row items-center justify-start">
                    <div className='flex flex-row justify-start items-center space-x-1'>
                        {world.allow_contribution ? <HandShakeIcon /> : <HandShakeSlashIcon />}
                        {world.allow_contribution ? <span>Allow Contribution</span> : <span>No Contribution</span>}
                    </div>
                </div>
                <div className="flex flex-row items-center justify-start">
                    <div className='flex flex-row justify-start items-center space-x-1'>
                        {world.allow_suggestion ? <LightBulbIcon /> : <LightBulbOffIcon />}
                        {world.allow_suggestion ? <span>Open for Request</span> : <span>Request Disabled</span>}
                    </div>
                </div>
            </div>
        </>
    )
}


const WorldCharactersDisplay = ({ world }: { world: World }) => {
    return (
        <>
            <div className='w-full flex flex-col text-left text-sm text-foreground/70 border p-5 space-y-4'>
                <div>
                    <FieldTitleDisplay label={'characters'} textSize="text-sm" />
                    <TagsBarSmallDisplay tags={world.characters} />
                </div>
                <div>
                    <FieldTitleDisplay label={'Relationship type'} textSize="text-sm" />
                    <TagsBarSmallDisplay tags={world.relationship_types[0] === "No Relationship" ? ["General (No Pairing)"] : world.relationship_types} />
                </div>
                {world.relationships.length > 0 && world.relationship_types[0] !== "No Relationship" && <div>
                    <FieldTitleDisplay label={'relationships'} textSize="text-sm" />
                    <TagsBarSmallDisplay tags={world.relationships} />
                </div>}
            </div>
        </>
    )
}

interface WorldDisplayProps {
    world: World;
    isOwner?: boolean;
    preview?: boolean;
}

export default function WorldDisplay({ world, isOwner = false, preview = false }: WorldDisplayProps) {
    const [subs, setSubs] = useState(0)
    useEffect(() => {
        const fetchSubs = async () => setSubs(await fetch_num_of_subs(world.id));
        fetchSubs()
    }, [])
    return (

        <div className='flex flex-col space-y-3 items-start text-foreground'>

            {!preview && <div id="button-group" className='w-full flex flex-row justify-between items-center'>
                <div className='flex flex-row space-x-2'>
                    <IconButtonMid icon={<StarIcon />} title={`${subs} subs`} />
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

            {preview ? null : <CopyableID id_string="World ID" id={world.id} />}

            <div id="title-group" className='w-full flex flex-row flex-wrap items-center justify-start'>
                <FieldContentDisplay content={world.name} textSize="text-4xl" bold="font-bold" />
                {world.nsfw && <Rating18PlusIcon className="w-10 h-10 text-left text-red-500" />}
            </div>

            <div id="metadata-group" className="w-full flex flex-col" >
                <WorldMetadataDisplay world={world} />
            </div>

            <div id='image-display' className="flex flex-row space-x-2 overflow-x-auto">
                <ImagesDisplayRow bucket="world" paths={world.images} dimension={{ height: "h-80", width: "w-80" }} />
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

            <div className='w-full max-w-2xl flex flex-col'>
                <WorldCharactersDisplay world={world} />
            </div>


            <div id="description-group" className='w-full flex flex-col'>
                <AccordionDisplay sections={world.description as WorldDescriptionSection[]} preview={preview} />
            </div>
            <div id="authors-group" className='w-full flex flex-col'>

            </div>

        </div>
    )
}