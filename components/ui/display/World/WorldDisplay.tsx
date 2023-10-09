'use client'
import type { WorldMetadata } from "@/app/supabase-server";
import { IconButtonMid, CopyableID } from "@/components/ui/button/button-helpers";
import { StarIcon, AtomIcon, Rating18PlusIcon, BookIcon, CalendarIcon, EyeIcon, EyeOffIcon, RatingGeneralIcon, HandShakeIcon, HandShakeSlashIcon, LightBulbIcon, LightBulbOffIcon, PencilIcon, SlashIcon, SingleUserIcon, DividerIcon, CreateIcon, CheckIcon, CrownIcon } from "@/components/icon/icon"
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
import { useEffect, useState } from "react";
import { sub_to_world, unsub_to_world, is_subbed } from "@/utils/stats-helpers";
import PopupDialog from "@/components/ui/input/PopupDialog";
import { notify_error, notify_success } from "@/components/ui/widget/toast";


interface WorldDisplayProps {
    world: WorldMetadata;
    preview?: boolean;
}

export default function WorldDisplay({ world, preview = false }: WorldDisplayProps) {
    const { user, tagMap } = useSupabase();

    const isOwner = world.creator_id === user?.id;
    const [subscribed, setSubscribed] = useState(false);
    const [subs, setSubs] = useState<number>(world.subscriptions[0].count)

    const [isUnSubConfirm, setIsUnSubConfirm] = useState(false);

    useEffect(() => {
        if (user) {
            const getSubInfo = async () => setSubscribed(await is_subbed(world.id, user.id));
            getSubInfo();
        }
    }, [user, setSubscribed])

    const onSub = () => {
        if (user) {
            try {
                sub_to_world(world.id, user.id);
                setSubs(subs + 1);
                setSubscribed(true);
                notify_success(`Subscribed to ${world.name} (${world.id})!`)
            } catch (error) {
                notify_error(`Unable to subscribe to world "${world.name}" (${world.id}): ${JSON.stringify(error)}`)
            }
        } else {
            // TODO: Logic for not logged in but want to sub
        }
    }

    return (

        <div className='flex flex-col space-y-3 items-start text-foreground'>

            {!preview &&
                <div id="stats" className="flex flex-row justify-between items-center w-full">
                    <span>
                        <CopyableID id_string="World ID" id={world.id} />
                    </span>
                    <div className="flex flex-row items-center space-x-2 font-mono text-xs text-foreground/80 font-semibold">
                        <div className="flex flex-row items-center space-x-1">
                            <SingleUserIcon />
                            <span>{subs} Subscribers</span>
                        </div>
                        <DividerIcon />
                        <div className="flex flex-row items-center space-x-1">
                            <CreateIcon />
                            <span>{world.pieces[0].count} Pieces</span>
                        </div>

                    </div>
                </div>
            }

            {!preview &&
                <div id="button-group" className='w-full flex flex-row justify-between items-center'>
                    <div className='flex flex-row space-x-1 text-sm md:text-base'>
                        {isOwner ?
                            <Link href={`/create-a-world?edit_id=${world.id}`}>
                                <button className={`flex flex-row items-center space-x-1  py-2 px-4 rounded-full primaryButton-pink`}>
                                    <PencilIcon />
                                    <span>Edit World</span>
                                </button>
                            </Link> :
                            !subscribed ? <button className={`flex flex-row items-center space-x-1  py-2 px-4 rounded-full primaryButton-pink`} onClick={onSub}>
                                <SingleUserIcon />
                                <span>Subscribe</span>
                            </button> : <button className={`flex flex-row items-center space-x-1  py-2 px-4 rounded-full secondaryButton-pink `} onClick={() => setIsUnSubConfirm(true)}>
                                <CheckIcon className="font-black" />
                                <span>Subscribed</span>
                            </button>
                        }
                        <Link href={{ pathname: '/create-a-piece', query: { world_id: world.id } }} >
                            <button className="flex flex-row items-center space-x-1 primaryButton-pink py-2 px-4 rounded-full">
                                <CreateIcon />
                                <span>Create a Piece</span>
                            </button>
                        </Link>
                    </div>
                </div>
            }

            <PopupDialog
                isOpen={isUnSubConfirm}
                setIsOpen={setIsUnSubConfirm}
                dialogTitle={`Unsubscribe from World`}
                dialogContent={`Are you sure you want to unsubscribe from "${world.name}"?`}
                initInputValue={''}
                confirmAction={() => {
                    try {
                        unsub_to_world(world.id, user!.id);
                        setSubscribed(false);
                        setSubs(subs - 1);
                        notify_success(`Unsubcribed from world "${world.name}" (${world.id})!`)
                    } catch (error) {
                        notify_error(`Unable to unsubscribe from world "${world.name}" (${world.id}): ${JSON.stringify(error)}`)
                    }
                }}
                dialogType='confirm'
            />

            <div id="title-group" className='w-full flex flex-row flex-wrap items-center justify-start'>
                <FieldContentDisplay content={world.name} textSize="text-4xl" bold="font-bold" />
            </div>

            <div id="gren-date-group" className="grid md:flex md:space-x-3 space-y-1 text-sm text-foreground/80 items-center">
                <div id="genre" className='flex flex-row justify-start items-center space-x-1'>
                    <BookIcon />
                    <div className='flex flex-row justify-start items-center capitalize font-medium'>
                        <span className="font-semibold">{tagMap[world.primary_genre!]}</span>
                        <SlashIcon />
                        <span>{tagMap[world.secondary_genre!]}</span>
                    </div>
                </div>
                <div id="date" className='flex flex-row justify-start items-center space-x-1'>
                    <CalendarIcon />
                    <span>{`Created ${getDistanceToNow(world.created_at)}`}</span>
                    <div className="ml-2" />
                    {world.modified_at && <CalendarIcon />}
                    {world.modified_at && <span>{`Updated ${getDistanceToNow(world.modified_at)}`}</span>}
                </div>
            </div>

            {world.profiles && !preview && <div id="author-group" className="w-full flex flex-col">
                <AuthorDisplay author={world.profiles} bannerContent="World Creator" icon={<CrownIcon className="text-brand" />} />
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
