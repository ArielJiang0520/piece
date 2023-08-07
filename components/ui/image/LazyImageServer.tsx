import { downloadImage } from "@/app/supabase-server";
import Image from "next/image";


interface LazyImageServerProps {
    bucket: string,
    path: string;
    dimension: string;
    rounded?: boolean
}

export const LazyImageServer = async ({ bucket, path, dimension, rounded = false }: LazyImageServerProps) => {
    const url = await downloadImage(bucket, path)

    if (url === null) {
        return <>Loading...</>
    } else {
        return <Image
            src={url}
            fill={true}
            alt="Picture of the author"
        />
    }
}