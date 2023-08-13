'use client'
import { Piece, World } from "@/types/types.world";
import PieceCard from "@/components/ui/display/Piece/PieceCard";
import SearchBar from "@/components/ui/input/SearchBar";
import { useEffect, useState, useRef } from 'react';
import Masonry from 'masonry-layout';
import Link from "next/link";
import DropDownSelector from "@/components/ui/input/DropDownSelector";
import { ToggleButton } from "@/components/ui/button/toggle/Toggle";
import { FieldContentDisplay } from "@/components/ui/display/display-helpers";

interface JoinedPiece extends Piece {
    worlds: { world_name: string } | null
}

interface ResultWorld {
    id: string;
    name: string;
    count: number;
}

function concatLists(worlds: World[], pieces: JoinedPiece[]): ResultWorld[] {
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

type SortFunc = { id: number, name: string, myFunc: (a: JoinedPiece, b: JoinedPiece) => number }

const sortFunc: SortFunc[] = [
    {
        id: 1,
        name: "Latest",
        myFunc: (a: JoinedPiece, b: JoinedPiece) => {
            const dateA = a.modified_at || a.created_at;
            const dateB = b.modified_at || b.created_at;
            // For descending order (latest to oldest)
            return dateB.localeCompare(dateA);
        }
    },
    {
        id: 2,
        name: "Oldest",
        myFunc: (a: JoinedPiece, b: JoinedPiece) => {
            const dateA = a.modified_at || a.created_at;
            const dateB = b.modified_at || b.created_at;
            // For ascending order 
            return dateA.localeCompare(dateB);
        }
    }
]

interface MyPiecesProps {
    pieces: JoinedPiece[],
    worlds: World[]
}
export default function MyPieces({ pieces, worlds }: MyPiecesProps) {
    const countWorlds = concatLists(worlds, pieces);

    const [currentWorld, setCurrentWorld] = useState<null | ResultWorld>(null);
    const [filteredPieces, setFilteredPieces] = useState<JoinedPiece[]>(pieces);

    const [privateOnly, setPrivateOnly] = useState(false)
    const [nsfwOnly, setNsfwOnly] = useState(false)
    const [currentSort, setCurrentSort] = useState<SortFunc>(sortFunc[0])

    const masonryGridRef = useRef<HTMLDivElement | null>(null);
    const masonryInstanceRef = useRef<Masonry | null>(null);

    useEffect(() => {
        if (masonryGridRef.current && !masonryInstanceRef.current) {
            masonryInstanceRef.current = new Masonry(masonryGridRef.current, {
                itemSelector: '.masonry-item',
                percentPosition: true
            });
        }

        const timeout = setTimeout(() => {
            if (masonryInstanceRef.current) {
                masonryInstanceRef.current.layout!();
            }
        }, 500);  // 100 ms delay. Adjust as needed.

        return () => {
            clearTimeout(timeout);
            if (masonryInstanceRef.current) {
                masonryInstanceRef.current.destroy!();
                masonryInstanceRef.current = null;
            }
        };
    }, [filteredPieces]);

    useEffect(() => {
        // Filter pieces based on the selected world
        const updatedFilteredPieces = currentWorld
            ? pieces.filter(piece => piece.world_id === currentWorld.id)
            : [...pieces];

        // Sort the filtered pieces
        updatedFilteredPieces
            .sort(currentSort.myFunc)

        setFilteredPieces(updatedFilteredPieces);

        // Trigger Masonry layout
        if (masonryInstanceRef.current) {
            masonryInstanceRef.current.layout!();
        }

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

                {/* <div className="flex justify-end items-center w-full md:w-auto ">
                    <div className="mr-2">
                        Private Only
                    </div>
                    <div>
                        <ToggleButton
                            handleToggle={setPrivateOnly}
                            isEnabled={privateOnly}
                        />
                    </div>


                    <div className="ml-6 mr-2">
                        NSFW Only
                    </div>
                    <div>
                        <ToggleButton
                            handleToggle={setNsfwOnly}
                            isEnabled={nsfwOnly}
                        />
                    </div>
                </div> */}

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
                    {`${filteredPieces.length} pieces found.`}
                </div>
            </div>

            <div ref={masonryGridRef} className="masonry-grid">
                {filteredPieces.map((piece) => (
                    <div key={piece.id} className="masonry-item w-1/2 lg:w-1/3 p-1">
                        <PieceCard piece={piece} />
                    </div>
                ))}
            </div>
        </div>
    );
}
