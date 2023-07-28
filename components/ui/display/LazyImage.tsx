'use client'
import { useState, useEffect } from 'react'
import { downloadImage } from "@/utils/image-helpers";

interface LazyImageProps {
    bucket: string,
    path: string;
    dimension: string
}

export const LazyImage: React.FC<LazyImageProps> = ({ bucket, path, dimension }) => {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        downloadImage(bucket, path)
            .then((url) => setUrl(url))
            .catch((error) => alert(error));

    }, [path]);

    if (url === null) {
        return (
            <div className={`${dimension} border rounded-xl flex justify-center items-center`}>
                <div className='w-6 h-6 border-t-4 border-foreground/50 border-opacity-80 rounded-full animate-spin' />
            </div>
        );
    } else {
        return <img src={url} alt="Placeholder Image" className={`h-full w-auto rounded-xl`} />;
    }
};

export default LazyImage;