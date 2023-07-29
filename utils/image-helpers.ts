import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { v4 as uuidv4 } from 'uuid';

export async function downloadImage(bucket_name: string, path: string) {
    const supabase = createClientComponentClient()
    let url = null

    const { data, error } = await supabase
        .storage
        .from(bucket_name)
        .download(path)

    if (error) {
        throw error
    }
    url = URL.createObjectURL(data)
    if (!url)
        throw Error(`Error downloading image ${error}`)

    return url
}

// Move each image from paths to bucket_name/folder_name/uid/{filename}
export async function copyImages(bucket_name: string, folder_name: string, uid: string, paths: string[]): Promise<string[]> {
    const supabase = createClientComponentClient()
    const newPaths = await Promise.all(paths.map(async (path, index) => {
        const newPath = `${folder_name}/${uid}/${path.split('/').pop()}`;
        const { data, error } = await supabase.storage
            .from(bucket_name)
            .copy(path, newPath);
        if (error) {
            console.log('error on path', path, newPath, JSON.stringify(error))
            throw (error)
        }
        return newPath;
    }));
    return newPaths;
}

export async function deleteImages(bucket_name: string, paths: string[]) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
        .storage
        .from(bucket_name)
        .remove(paths)
    if (error) {
        alert(error)
    }
}