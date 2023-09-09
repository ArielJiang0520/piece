'use client'
import { CloseIcon } from '@/components/icon/icon';
import LazyImage from '@/components/ui/image/LazyImage';
import useHorizontalDragScroll from '@/hooks/useHorizontalScroll';
import { useEffect, useState } from 'react';
import { downloadImage } from '@/utils/image-helpers';

interface ImagesDisplayRowProps {
    bucket: string;
    dimension: {
        height: string;
        width: string;
    };
    paths: string[];
    del?: {
        hasDelete: boolean;
        onDelete: (arg: any) => void;
    };
    popup?: boolean
}

const defaultDeleteFunction = () => { };

export function ImagesDisplayRow({ bucket, dimension, paths, del = { hasDelete: false, onDelete: defaultDeleteFunction }, popup = false }: ImagesDisplayRowProps) {
    const initialURLs = paths.reduce((accumulator: Record<string, string | null>, currentPath: string) => {
        return { ...accumulator, [currentPath]: null };
    }, {} as Record<string, string | null>);
    const [imageUrls, setImageUrls] = useState(initialURLs);
    const { startDrag, stopDrag, doDrag } = useHorizontalDragScroll();

    useEffect(() => {
        paths.forEach(path => {
            downloadImage(bucket, path)
                .then((url: string) => setImageUrls(prev => ({ ...prev, [path]: url })))
                .catch(console.error);
        })
    }, [bucket, paths]);

    return <div id='image-display' className="flex flex-row space-x-2 horizontal-scroll hide-scrollbar"
        onMouseDown={startDrag}
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
        onMouseMove={doDrag}
    >
        {paths.map((path, index) => (
            <div key={path} className={`relative ${dimension.height} flex-shrink-0`}>
                <LazyImage url={imageUrls[path]} dimension={`${dimension.height} ${dimension.width}`} rounded={true} popup={popup} />
                {del.hasDelete && (
                    <button
                        id="delete-button"
                        onClick={() => del.onDelete(index)}
                        type="button"
                        className="absolute top-5 right-5 bg-foreground text-background rounded-full w-5 h-5 flex items-center justify-center opacity-70 p-1"
                        style={{ transform: 'translate(50%,-50%)' }}
                    >
                        <CloseIcon />
                    </button>
                )}
            </div>
        ))}
    </div>;
}
