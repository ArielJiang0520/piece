'use client'
import { useEffect, useState } from "react";
import WorldCard from "@/components/ui/display/World/WorldCard";
import { World } from "@/types/types.world";
import SearchBar from "@/components/ui/input/SearchBar";
import DropDownSelector from "@/components/ui/input/DropDownSelector";
import { ToggleButton } from "@/components/ui/button/toggle/Toggle";
import Link from "next/link";

interface MyWorldsProps {
    worlds: World[],
    isOwner: boolean
}

type SortFunc = { id: number, name: string, myFunc: (a: World, b: World) => number }

export default function MyWorlds({ worlds, isOwner }: MyWorldsProps) {
    const [filteredWorlds, setFilteredWorlds] = useState<World[]>(worlds)
    const [currentQuery, setCurrentQuery] = useState<null | World>(null)
    const [privateOnly, setPrivateOnly] = useState(false)
    const [nsfwOnly, setNsfwOnly] = useState(false)


    const sortFunc: SortFunc[] = [
        {
            id: 1,
            name: "Latest",
            myFunc: (a: World, b: World) => {
                const dateA = a.modified_at || a.created_at;
                const dateB = b.modified_at || b.created_at;
                // For descending order (latest to oldest)
                return dateB.localeCompare(dateA);
            }
        },
        {
            id: 2,
            name: "Oldest",
            myFunc: (a: World, b: World) => {
                const dateA = a.modified_at || a.created_at;
                const dateB = b.modified_at || b.created_at;
                // For ascending order 
                return dateA.localeCompare(dateB);
            }
        },
        {
            id: 3,
            name: "Alphabetical",
            myFunc: (a: World, b: World) => {
                const dateA = a.world_name;
                const dateB = b.world_name;
                // For ascending order
                return dateA.localeCompare(dateB);
            }
        },
    ]
    const [currentSort, setCurrentSort] = useState<SortFunc>(sortFunc[0])

    useEffect(() => {
        const updatedFilteredWorlds = worlds.sort(currentSort.myFunc)
            .filter(world => currentQuery ? world.id === currentQuery.id : true)
            .filter(world => privateOnly ? !world.is_public : true)
            .filter(world => nsfwOnly ? world.nsfw : true)
        setFilteredWorlds(updatedFilteredWorlds)
    }, [currentSort, currentQuery, privateOnly, nsfwOnly])

    return <div className="flex flex-col">
        <div id="search-bar" className="flex flex-col md:flex-row md:items-center mb-6">

            <button className="w-full md:w-auto mb-4 md:mb-0 order-1 md:order-2 text-base px-3 py-2 primaryButton">
                <Link href={'/create-a-world'}> Create a World </Link>
            </button>

            <div className="flex-grow w-full md:mr-4 order-2 md:order-1 z-30">
                <SearchBar
                    candidates={worlds}
                    nameKey="world_name"
                    placeholder={"Find your world..."}
                    onSelect={setCurrentQuery}
                />
            </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-end space-y-1 md:space-x-6 md:space-y-0 text-sm">
            {/* <!-- Row for the Toggle Buttons on small screens --> */}
            <div className="flex justify-end items-center w-full md:w-auto ">
                {isOwner && <> <div className="mr-2">
                    Private Only
                </div>
                    <div>
                        <ToggleButton
                            handleToggle={setPrivateOnly}
                            isEnabled={privateOnly}
                        />
                    </div></>}

                <div className="ml-6 mr-2">
                    NSFW Only
                </div>
                <div>
                    <ToggleButton
                        handleToggle={setNsfwOnly}
                        isEnabled={nsfwOnly}
                    />
                </div>
            </div>

            {/* <!-- Row for the Sort by bar on small screens --> */}
            <div className="flex justify-end items-center w-full md:w-auto space-x-2">
                <span className="">Sort by</span>
                <span className="z-20">
                    <DropDownSelector
                        data={sortFunc}
                        selected={currentSort}
                        setSelected={setCurrentSort}
                        width="w-40"
                        nameKey="name"
                    />
                </span>
            </div>
        </div>


        <div className="flex flex-row w-full justify-start items-center p-2">
            <div className="font-mono text-xs font-medium">
                {`${filteredWorlds.length} worlds found.`}
            </div>
        </div>
        <div className="flex flex-col space-y-2 mt-2">
            {filteredWorlds.map((world, idx) => <WorldCard key={idx} world={world} isOwner={isOwner} />)
            }
        </div>
    </div>
}