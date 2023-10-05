'use client'
import { Piece, World } from '@/types/types';
import Masonry from 'masonry-layout';
import { useRef, useEffect } from 'react';
import PieceCard from './PieceCard';
import Link from 'next/link';
import { PieceDetails } from '@/app/supabase-server';

interface PiecesMasonryProps {
    pieces: PieceDetails[],
    world: World
}
export default function PiecesMasonry({ pieces, world }: PiecesMasonryProps) {
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
        }, 1000);  // 100 ms delay. Adjust as needed.

        return () => {
            clearTimeout(timeout);
            if (masonryInstanceRef.current) {
                masonryInstanceRef.current.destroy!();
                masonryInstanceRef.current = null;
            }
        };
    }, [pieces]);

    return <div ref={masonryGridRef} className="masonry-grid">
        {pieces.map((piece: PieceDetails) => (
            <Link key={piece.id} href={`/pieces/${piece.id}`}>
                <div key={piece.id} className="masonry-item w-full lg:w-1/2 xl:w-1/3 2xl:w-1/4 p-1">
                    <PieceCard piece={piece} isOwner={piece.creator_id === world.creator_id} />
                </div>
            </Link>
        ))}
    </div>
}


