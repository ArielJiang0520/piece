'use client'
import LazyImage from '@/components/ui/image/LazyImage';
import { useEffect, useState } from 'react';
import { downloadImage } from '@/utils/image-helpers';


interface PieceImagesProps {
    bucket: string;
    paths: string[];
    popup?: boolean
}

export default function PieceImages({ bucket, paths, popup = false }: PieceImagesProps) {
    const initialURLs = paths.reduce((accumulator: Record<string, string | null>, currentPath: string) => {
        return { ...accumulator, [currentPath]: null };
    }, {} as Record<string, string | null>);
    const [imageUrls, setImageUrls] = useState(initialURLs);

    useEffect(() => {
        paths.forEach(path => {
            downloadImage(bucket, path)
                .then((url: string) => setImageUrls(prev => ({ ...prev, [path]: url })))
                .catch(console.error);
        })
    }, [bucket, paths]);

    return <div className='flex flex-col w-full'>
        {paths.map((path, index) => <div key={index} className={""}>
            <LazyImage url={imageUrls[path]} dimension={`h-auto w-full`} rounded={false} popup={popup} />
        </div>)}

    </div>
}