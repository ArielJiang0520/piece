'use client'
import { World, Fandom } from "@/types/types";
import { FieldContentDisplay, FieldTitleDisplay } from "@/components/ui/display/display-helpers";
import { CalendarIcon, EyeIcon, EyeOffIcon, TrashIcon, DotsVerticalIcon, BookIcon, SingleUserIcon, PencilIcon, Rating18PlusIcon, RatingGeneralIcon, StarIcon, AtomIcon } from "@/components/icon/icon";
import { formatTimestamp } from "@/utils/helpers";
import { ImagesDisplayRow } from "@/components/ui/image/ImagesDisplayRow";
import Link from "next/link";
import { useState, useEffect } from "react";
import { DropDownMenu, DropDownMenuOptions } from "@/components/ui/menu/InPlaceDropDownMenu";
import { useRouter } from "next/navigation";
import { TagsBarDisplay } from "@/components/ui/input/tags-helpers";
import { fetch_all_fandoms } from "@/utils/data-helpers";
import { fetch_num_of_pieces, fetch_num_of_subs } from "@/utils/world-helpers";
import { TagsBarSmallDisplay } from "@/components/ui/input/tags-helpers";

interface WorldCardProps {
    world: World,
    isOwner: boolean
}
export default function WorldCard({ world, isOwner }: WorldCardProps) {
    const ownerMenu: DropDownMenuOptions[] = [
        { name: 'Edit', icon: PencilIcon, function: () => { router.push(`/create-a-world?edit_id=${world.id}`) } },
        { name: 'Delete', icon: TrashIcon, function: () => { } }
    ]

    const guestMenu: DropDownMenuOptions[] = [
        { name: 'Create a Piece', icon: PencilIcon, function: () => { router.push(`/create-a-piece?world_id=${world.id}`) } },
        { name: 'Subscribe', icon: TrashIcon, function: () => { } }
    ]

    const router = useRouter()
    const [fandoms, setFandoms] = useState<Fandom[]>([])
    const [numPieces, setNumPieces] = useState(0)
    const [subs, setSubs] = useState(0)
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const worldOrigin = world.origin ? fandoms.find(item => item.id === world.origin)?.name || null : "Original World"

    useEffect(() => {
        const fetchFandoms = async () => setFandoms(await fetch_all_fandoms());
        const fetchNumPieces = async () => setNumPieces(await fetch_num_of_pieces(world.id));
        const fetchSubs = async () => setSubs(await fetch_num_of_subs(world.id));

        if (world.origin)
            fetchFandoms()

        fetchNumPieces()
        fetchSubs()

    }, [])

    return (
        <div className="flex flex-col space-y-4 rounded-lg bg-foreground/5 p-4">

            <div className="flex flex-row w-full justify-between space-x-6 text-sm text-foreground/80 font-medium text-left">

                <div className="flex flex-row  items-center  space-x-1 w-40 md:w-80  ">
                    <BookIcon className="flex-shrink-0" />
                    <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">{worldOrigin}</span>
                </div>
                <div className="flex flex-row space-x-4">
                    <div className="flex flex-row  items-center space-x-1 ">
                        <StarIcon />
                        <div className="whitespace-nowrap">
                            {`${subs} subs`}
                        </div>
                    </div>
                    <div className="flex flex-row items-center space-x-1">
                        <AtomIcon />
                        <div className="whitespace-nowrap">
                            {`${numPieces} pieces`}
                        </div>
                    </div>
                </div>
            </div>



            <div className="flex flex-row w-full justify-between items-center">

                <div className="flex flex-row text-left w-56 md:w-80 ">
                    <FieldContentDisplay textSize="text-xl" content={world.name} bold={"font-bold"} />
                </div>



                <div className="flex flex-row justify-end items-center text-right space-x-1">

                    <Link href={`/worlds/${world.id}`}>
                        <button className="primaryButton text-sm px-4 py-1">
                            View
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

            {world.origin != null && world.relationship_types[0] != "No Relationship" && <div className="w-full flex flex-row">
                {/* <FieldTitleDisplay label={'Ships'} textSize="text-xs" /> */}
                <TagsBarSmallDisplay tags={world.relationships} small={true} scroll={true} />
            </div>}


            <div className="w-full">
                <FieldContentDisplay content={world.logline} textSize="text-sm" bold="font-normal" />
            </div>

            <div className="w-full">
                <ImagesDisplayRow bucket="world" dimension={{ height: "h-64", width: "w-64" }} paths={world.images} />
            </div>

            <div className="w-full">
                <TagsBarDisplay tags={world.tags} scroll={true} />
            </div>



            <div className="flex flex-row w-full justify-between text-foreground/80 text-base items-center mt-2">
                <div className="flex flex-row justify-start items-center text-right  space-x-1">
                    {world.is_public ? <EyeIcon /> : <EyeOffIcon />} {world.nsfw ? <Rating18PlusIcon className="text-red-500" /> : <RatingGeneralIcon className="text-green-700" />}
                </div>
                <div className="flex flex-row justify-end items-center text-right  space-x-1">
                    <CalendarIcon />
                    <span className="text-xs">{world.modified_at ? `Updated on ${formatTimestamp(world.modified_at, true)}` : `Created on ${formatTimestamp(world.created_at, true)}`}</span>
                </div>
            </div>
        </div>
    )
}