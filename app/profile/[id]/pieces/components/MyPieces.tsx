'use client'
import { Piece, World, JoinedWorldPiece } from "@/types/types.world";
import SearchBar from "@/components/ui/input/SearchBar";
import { useEffect, useState, useRef } from 'react';
import Link from "next/link";
import DropDownSelector from "@/components/ui/input/DropDownSelector";
import PiecesMasonry from "@/components/ui/display/Piece/PiecesMasonry";

interface ResultWorld {
    id: string;
    name: string;
    count: number;
}

function concatLists(worlds: World[], pieces: JoinedWorldPiece[]): ResultWorld[] {
    const resultMap: Map<string, ResultWorld> = new Map();

    // Process the worlds list
    for (const world of worlds) {
        resultMap.set(world.id, {
            id: world.id,
            name: world.world_name,
            count: 0
        });
    }

    // Process the pieces list
    for (const piece of pieces) {
        if (piece.world_id === null || piece.worlds === null) {
            const orphanedWorld = resultMap.get("-1");
            if (orphanedWorld) {
                orphanedWorld.count += 1;
            } else {
                resultMap.set("-1", {
                    id: "-1",
                    name: "orphaned world",
                    count: 0
                });
            }
        } else {
            const existingWorld = resultMap.get(piece.world_id);
            if (existingWorld) {
                existingWorld.count += 1;
            } else {
                resultMap.set(piece.world_id, {
                    id: piece.world_id,
                    name: piece.worlds.world_name,
                    count: 0
                });
            }
        }
    }

    const result: ResultWorld[] = Array.from(resultMap.values());
    result.sort((a, b) => b.count - a.count); // Sort by count in descending order
    return result;
}

type SortFunc = { id: number, name: string, myFunc: (a: JoinedWorldPiece, b: JoinedWorldPiece) => number }

const sortFunc: SortFunc[] = [
    {
        id: 1,
        name: "Latest",
        myFunc: (a: JoinedWorldPiece, b: JoinedWorldPiece) => {
            const dateA = a.modified_at || a.created_at;
            const dateB = b.modified_at || b.created_at;
            // For descending order (latest to oldest)
            return dateB.localeCompare(dateA);
        }
    },
    {
        id: 2,
        name: "Oldest",
        myFunc: (a: JoinedWorldPiece, b: JoinedWorldPiece) => {
            const dateA = a.modified_at || a.created_at;
            const dateB = b.modified_at || b.created_at;
            // For ascending order 
            return dateA.localeCompare(dateB);
        }
    }
]

interface MyPiecesProps {
    pieces: JoinedWorldPiece[],
    worlds: World[]
}
export default function MyPieces({ pieces, worlds }: MyPiecesProps) {
    const countWorlds = concatLists(worlds, pieces);
    const [currentWorld, setCurrentWorld] = useState<null | ResultWorld>(null);
    const [filteredPieces, setFilteredPieces] = useState<JoinedWorldPiece[]>(pieces);
    const [currentSort, setCurrentSort] = useState<SortFunc>(sortFunc[0])

    useEffect(() => {
        // Filter pieces based on the selected world
        const updatedFilteredPieces = currentWorld
            ? pieces.filter(piece => piece.world_id === currentWorld.id)
            : [...pieces];

        // Sort the filtered pieces
        updatedFilteredPieces
            .sort(currentSort.myFunc)

        setFilteredPieces(updatedFilteredPieces);

    }, [currentWorld, currentSort]);

    return (
        <div className="flex flex-col">
            <div id="search-bar" className="flex flex-col md:flex-row md:items-center mb-6">
                <button className="w-full md:w-auto mb-4 md:mb-0 order-1 md:order-2 text-base px-3 py-2 primaryButton">
                    <Link href={'/create-a-piece'}> Create a Piece </Link>
                </button>

                <div className="flex-grow w-full md:mr-4 order-2 md:order-1 z-30">
                    <SearchBar
                        candidates={countWorlds}
                        nameKey="name"
                        placeholder={"Filter by world"}
                        onSelect={setCurrentWorld}
                        display_func={(item: ResultWorld) => `${item.name} (${item.count})`}
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-end space-y-1 md:space-x-6 md:space-y-0 text-sm">
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


            <div className="px-6">
                <div className="flex flex-row w-full justify-start items-center p-2">
                    <div className="font-mono text-xs font-medium">
                        {`${filteredPieces.length} pieces found.`}
                    </div>
                </div>
                <PiecesMasonry pieces={filteredPieces} />
            </div>

        </div>
    );
}
