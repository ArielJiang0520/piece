'use client'
import { Piece, World, JoinedWorldPiece } from "@/types/types";
import SearchBar from "@/components/ui/input/SearchBar";
import { useEffect, useState, useRef } from 'react';
import Link from "next/link";
import DropDownSelector from "@/components/ui/input/DropDownSelector";
// import PiecesMasonry from "@/components/ui/display/Piece/PiecesMasonry";
import dynamic from 'next/dynamic';

const PiecesMasonry = dynamic(() => import('@/components/ui/display/Piece/PiecesMasonry'), {
    ssr: false
});

type SortFunc = { id: number, name: string, myFunc: (a: Piece, b: Piece) => number }

const sortFunc: SortFunc[] = [
    {
        id: 1,
        name: "Latest",
        myFunc: (a: Piece, b: Piece) => {
            const dateA = a.modified_at || a.created_at;
            const dateB = b.modified_at || b.created_at;
            // For descending order (latest to oldest)
            return dateB.localeCompare(dateA);
        }
    },
    {
        id: 2,
        name: "Oldest",
        myFunc: (a: Piece, b: Piece) => {
            const dateA = a.modified_at || a.created_at;
            const dateB = b.modified_at || b.created_at;
            // For ascending order 
            return dateA.localeCompare(dateB);
        }
    }
]

interface WorldPiecesProps {
    world: World
    pieces: Piece[]
}
export default function WorldPieces({ pieces, world }: WorldPiecesProps) {
    const [filteredPieces, setFilteredPieces] = useState<Piece[]>(pieces);
    const [currentSort, setCurrentSort] = useState<SortFunc>(sortFunc[0])

    useEffect(() => {
        // Filter pieces based on the selected world
        const updatedFilteredPieces = pieces

        // Sort the filtered pieces
        updatedFilteredPieces
            .sort(currentSort.myFunc)

        setFilteredPieces(updatedFilteredPieces);

    }, [currentSort]);

    return (
        <div className="flex flex-col">
            <div id="search-bar" className="flex flex-col md:flex-row md:items-center mb-6">
                <button className="w-full  mb-4 md:mb-0 order-1 md:order-2 text-base px-3 py-2 primaryButton">
                    <Link href={`/create-a-piece?world_id=${world.id}`}> Create a Piece </Link>
                </button>

                {/* <div className="flex-grow w-full md:mr-4 order-2 md:order-1 z-30">
                    <SearchBar
                        candidates={countWorlds}
                        nameKey="name"
                        placeholder={"Filter by world"}
                        onSelect={setCurrentWorld}
                        display_func={(item: ResultWorld) => `${item.name} (${item.count})`}
                    />
                </div> */}
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


            <div className="px-1">
                <div className="flex flex-row w-full justify-start items-center p-2">
                    <div className="font-mono text-xs font-medium">
                        {`${filteredPieces.length} pieces found.`}
                    </div>
                </div>
                <PiecesMasonry pieces={filteredPieces} world={world} displayAuthor={true} />
            </div>

        </div>
    );
}
