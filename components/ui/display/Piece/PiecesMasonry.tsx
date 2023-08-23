'use client'
import { JoinedWorldPiece, JoinedAuthorPiece, Piece, World } from '@/types/types';
import Masonry from 'masonry-layout';
import { useRef, useEffect } from 'react';
import PieceCard from './PieceCard';

interface PiecesMasonryProps {
    pieces: Piece[] | JoinedWorldPiece[] | JoinedAuthorPiece[],
    world?: World | null;
    displayAuthor?: boolean
}
export default function PiecesMasonry({ pieces, world = null, displayAuthor = false }: PiecesMasonryProps) {
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
    }, [pieces]);

    return <div ref={masonryGridRef} className="masonry-grid">
        {pieces.map((piece) => (
            <div key={piece.id} className="masonry-item w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 p-1">
                <PieceCard author={(piece as JoinedAuthorPiece).profiles} piece={piece} isOwner={(piece as JoinedAuthorPiece).profiles?.id === world?.creator_id} displayAuthor={displayAuthor} />
            </div>
        ))}
    </div>
}