'use client'
import type { WorldMetadata } from "@/app/supabase-server";
import { FieldContentDisplay, FieldTitleDisplay } from "@/components/ui/display/display-helpers";
import { CalendarIcon, SlashIcon, EyeIcon, EyeOffIcon, TrashIcon, DotsVerticalIcon, BookIcon, SingleUserIcon, PencilIcon, Rating18PlusIcon, RatingGeneralIcon, StarIcon, AtomIcon, HandShakeIcon, HandShakeSlashIcon, LightBulbOffIcon, LightBulbIcon, StarsIcon, OpenBookIcon } from "@/components/icon/icon";
import { getDistanceToNow } from "@/utils/helpers";
import { ImagesDisplayRow } from "@/components/ui/image/ImagesDisplayRow";
import Link from "next/link";
import { useState, useEffect } from "react";
import { DropDownMenu, DropDownMenuOptions } from "@/components/ui/menu/InPlaceDropdown";
import { useRouter } from "next/navigation";
import { TagsBarDisplay } from "@/components/ui/input/tags-helpers";
import { TagsBarSmallDisplay } from "@/components/ui/input/tags-helpers";
import Image from "next/image";
import { useSupabase } from "@/app/supabase-provider";

interface WorldCardProps {
    world: WorldMetadata,
    isOwner: boolean
}
export default function WorldCard({ world, isOwner }: WorldCardProps) {
    const { tagMap } = useSupabase();
    const ownerMenu: DropDownMenuOptions[] = [
        { name: 'Edit', icon: PencilIcon, function: () => { router.push(`/create-a-world?edit_id=${world.id}`) } },
        { name: 'Delete', icon: TrashIcon, function: () => { } }
    ]

    const guestMenu: DropDownMenuOptions[] = [
        { name: 'Create a Piece', icon: PencilIcon, function: () => { router.push(`/create-a-piece?world_id=${world.id}`) } },
        { name: 'Subscribe', icon: TrashIcon, function: () => { } }
    ]

    const router = useRouter()

    const [dropdownVisible, setDropdownVisible] = useState(false)

    const tags: string[] = [
        // ...(world.relationship_types[0] === "No Relationship" ? [] : world.relationship_types),
        ...(world.nsfw ? ["🔞 NSFW Content"] : []),
    ]
    return (
        <div className="flex flex-col space-y-4 rounded-lg bg-foreground/5 p-4">

            <div className="flex flex-row w-full justify-between space-x-6 text-sm text-foreground/80 font-medium text-left">
                <div className="flex flex-row items-center  space-x-1 w-40 md:w-80  ">
                    <BookIcon className="flex-shrink-0" />
                    <div className='flex flex-row justify-start items-center capitalize font-medium whitespace-nowrap'>
                        <span className="font-semibold">{tagMap[world.primary_genre!]}</span>
                        <SlashIcon />
                        <span>{tagMap[world.secondary_genre!]}</span>
                    </div>
                </div>
                <div className="flex flex-row space-x-4">
                    <div className="flex flex-row  items-center space-x-1 ">
                        <SingleUserIcon />
                        <div className="whitespace-nowrap">
                            {`${world.subscriptions[0].count} Subs`}
                        </div>
                    </div>
                    <div className="flex flex-row items-center space-x-1">
                        <AtomIcon />
                        <div className="whitespace-nowrap">
                            {`${world.pieces[0].count} Pieces`}
                        </div>
                    </div>
                </div>
            </div>


            <div id='title-group' className="flex flex-col md:flex-row w-full md:items-center md:justify-between space-y-3">
                <div className="flex flex-row items-center  text-left ">
                    <FieldContentDisplay textSize="text-xl md:text-2xl" content={world.name} bold={"font-bold"} />
                </div>

                <div className="flex flex-row items-center text-right space-x-1 ">
                    <Link href={`/worlds/${world.id}/explore`}>
                        <button className="flex flex-row items-center space-x-2 primaryButton-pink py-1 px-4 rounded-lg text-sm">
                            <StarsIcon />
                            <span>Explore in AI</span>
                        </button>
                    </Link>
                    <Link href={`/worlds/${world.id}`}>
                        <button className="flex flex-row items-center space-x-2 primaryButton  py-1 px-4 rounded-lg text-sm">
                            <OpenBookIcon />
                            <span>View</span>
                        </button>
                    </Link>

                    {isOwner && <div className='relative z-10'>
                        <DotsVerticalIcon
                            className='cursor-pointer'
                            size={20}
                            onClick={() => setDropdownVisible(true)}
                        />
                        {dropdownVisible && <DropDownMenu setDropdownVisible={setDropdownVisible} options={isOwner ? ownerMenu : guestMenu} />}
                    </div>}
                </div>
            </div>

            <div className="w-full">
                <FieldContentDisplay content={world.logline} textSize="text-sm" bold="font-normal" />
            </div>

            {tags.length > 0 && <div className="flex flex-row justify-start items-center">
                <TagsBarSmallDisplay tags={tags} small={true} />

            </div>}


            <div className="w-full">
                <ImagesDisplayRow bucket="world" dimension={{ height: "h-80", width: "w-80" }} paths={world.images} />
            </div>

            <div className="w-full">
                <TagsBarDisplay tags={world.tags} scroll={true} />
            </div>

            <div className="flex flex-row w-full">
                {world.profiles &&

                    <div className="flex flex-row w-full justify-between text-foreground   text-sm font-mono">
                        <div className="flex flex-row justify-start items-center text-right  space-x-1">
                            <Image
                                className='block rounded-full'
                                src={world.profiles.avatar_url ? world.profiles.avatar_url : 'logo_500px.png'}
                                alt={"profile picture"}
                                width={20} height={20}
                                onClick={() => { }}
                            />

                            <div className="w-auto overflow-hidden font-medium">{world.profiles.full_name ? world.profiles.full_name : "Deleted User"}</div>
                        </div>
                        <div className="flex flex-row justify-end items-center text-right  space-x-1">
                            <CalendarIcon />

                            <span className="text-xs">{world.modified_at ? `Updated ${getDistanceToNow(world.modified_at)}` : `Created ${getDistanceToNow(world.created_at)}`}</span>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}