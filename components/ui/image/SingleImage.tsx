'use client'
import { useState, useEffect } from 'react'
import { downloadImage } from "@/utils/image-helpers";

interface SingleImageProps {
    bucket: string,
    path: string;
    dimension: string;
    rounded?: boolean
}

export const SingleImage: React.FC<SingleImageProps> = ({ bucket, path, dimension, rounded = false }) => {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        downloadImage(bucket, path)
            .then((url) => setUrl(url))
            .catch((error) => console.error(error));

    }, [path]);

    if (url === null) {
        return (
            <div className={`${dimension} border ${rounded ? "rounded-lg" : ""} flex justify-center items-center`}>
                <div className='w-6 h-6 border-t-4 border-foreground/50 border-opacity-80 rounded-full animate-spin' />
            </div>
        );
    } else {
        return <img src={url} alt="Placeholder Image" className={`w-full h-auto ${rounded ? "rounded-lg" : ""}`} />;
    }
};

export default SingleImage;