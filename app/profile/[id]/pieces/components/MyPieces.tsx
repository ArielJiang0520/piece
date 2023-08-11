'use client'
import { Piece, World } from "@/types/types.world";
import PieceCard from "@/components/ui/display/Piece/PieceCard";
import SearchBar from "@/components/ui/input/SearchBar";
import { useEffect, useState, useRef } from 'react';
import Masonry from 'masonry-layout';
import Link from "next/link";
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


interface MyPiecesProps {
    pieces: JoinedPiece[],
    worlds: World[]
}
export default function MyPieces({ pieces, worlds }: MyPiecesProps) {
    const countWorlds = concatLists(worlds, pieces);

    const [currentWorld, setCurrentWorld] = useState<null | ResultWorld>(null);
    const [filteredPieces, setFilteredPieces] = useState<JoinedPiece[]>([]);

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
        }, 100);  // 100 ms delay. Adjust as needed.

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
        updatedFilteredPieces.sort((a, b) => {
            const dateA = a.created_at;
            const dateB = b.created_at;
            return dateB.localeCompare(dateA);  // Descending order
        });

        setFilteredPieces(updatedFilteredPieces);

        // Trigger Masonry layout
        if (masonryInstanceRef.current) {
            masonryInstanceRef.current.layout!();
        }

    }, [currentWorld, pieces]);

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
