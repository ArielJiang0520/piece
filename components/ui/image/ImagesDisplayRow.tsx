'use client'
import { CloseIcon } from '@/components/icon/icon';
import LazyImage from '@/components/ui/image/LazyImage';
import useHorizontalDragScroll from '@/hooks/useHorizontalScroll';
import { useEffect, useState } from 'react';
import { downloadImage } from '@/utils/image-helpers';
import Link from 'next/link';

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
    blur?: boolean
}

const defaultDeleteFunction = () => { };

export function ImagesDisplayRow({
    bucket,
    dimension,
    paths,
    del = { hasDelete: false, onDelete: defaultDeleteFunction },
    popup = false,
    blur = false
}: ImagesDisplayRowProps) {
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

    return <div className={`relative`}>
        {blur && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 ">
                <div className='text-white text-base font-mono flex flex-col items-center justify-center'>
                    <div className="text-center">World with NSFW content will automatically blur images. </div>
                    <div className='flex flex-col md:flex-row items-center space-y-1 md:space-x-2'>
                        <p>Disable this in</p>
                        <div className='primaryButton px-2 py-1 rounded-xl '><Link href={`/profiles`}>Account Settings</Link></div>
                    </div>
                </div>
            </div>
        )}
        <div id='image-display' className="flex flex-row space-x-2 horizontal-scroll hide-scrollbar"
            onMouseDown={startDrag}
            onMouseLeave={stopDrag}
            onMouseUp={stopDrag}
            onMouseMove={doDrag}
        >
            {paths.map((path, index) => (
                <div key={path} className={`relative ${dimension.height} flex-shrink-0`}>

                    <LazyImage url={imageUrls[path]} dimension={`${dimension.height} ${dimension.width}`} rounded={true} popup={popup} blur={blur} />

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
        </div>
    </div>;
}
