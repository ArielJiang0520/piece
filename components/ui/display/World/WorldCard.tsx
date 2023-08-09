'use client'
import { World } from "@/types/types.world";
import { FieldContentDisplay } from "@/components/ui/display/display-helpers";
import { CalendarIcon, EyeIcon, EyeOffIcon, TrashIcon, DotsVerticalIcon, BookIcon, SingleUserIcon, PencilIcon, Rating18PlusIcon, RatingGeneralIcon } from "@/components/icon/icon";
import { formatTimestamp } from "@/utils/helpers";
import { ImagesDisplayRow } from "@/components/ui/image/ImagesDisplayRow";
import Link from "next/link";
import { useState } from "react";
import { DropDownMenu, DropDownMenuOptions } from "@/components/ui/menu/DropDownMenu";
import { useRouter } from "next/navigation";

interface WorldCardProps {
    world: World,
    isOwner: boolean
}


export default function WorldCard({ world, isOwner }: WorldCardProps) {
    if (!isOwner && !world.is_public)
        return null;

    const menuOptions: DropDownMenuOptions[] = [
        { name: 'Edit', icon: PencilIcon, function: () => { router.push(`/create-a-world?edit_id=${world.id}`) } },
        { name: 'Delete', icon: TrashIcon, function: () => { } }
    ]

    const router = useRouter()
    const [dropdownVisible, setDropdownVisible] = useState(false)
    return (
        <div className="flex flex-col space-y-4 rounded-lg bg-foreground/5 p-4">
            <div className="flex flex-row w-full justify-between items-center">

                <div className="flex flex-row text-left w-56 md:w-80 ">
                    <FieldContentDisplay textSize="text-lg" content={world.world_name} bold={"font-bold"} />
                </div>

                <div className="flex flex-row justify-end items-center text-right space-x-2">

                    <Link href={`/world/${world.id}`}>
                        <button className="primaryButton text-base px-4 py-1">
                            View
                        </button>
                    </Link>

                    {isOwner && <div className='relative'>
                        <DotsVerticalIcon
                            className='cursor-pointer'
                            size={20}
                            onClick={() => setDropdownVisible(true)}
                        />
                        {dropdownVisible && <DropDownMenu setDropdownVisible={setDropdownVisible} options={menuOptions} />}
                    </div>}
                </div>

            </div>

            <div className="flex flex-row w-full justify-start space-x-6 text-sm text-foreground/80 font-medium text-left">
                <div className="flex flex-row  items-center  space-x-1">
                    <BookIcon />
                    <span>{world.origin ? origin : "Original World"}</span>
                </div>
                <div className="flex flex-row  items-center space-x-1">
                    <SingleUserIcon />
                    <div className=" ">
                        123
                    </div>
                </div>
                <div className="flex flex-row items-center space-x-1">
                    <PencilIcon />
                    <div className="">
                        23
                    </div>
                </div>
            </div>

            <div className="w-full">
                <ImagesDisplayRow dimension={{ height: "h-40", width: "w-40" }} paths={world.images} />
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