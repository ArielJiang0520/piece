'use client'
import { useEffect, useState, useRef } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { Bubble } from '@/components/ui/widget/bubble';
import { useSupabase } from '@/app/supabase-provider';
import type { User } from '@supabase/supabase-js';
import { ImCross } from 'react-icons/im';

export default function CoversUpload() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { supabase } = useSupabase()
    const [displayImages, setDisplayImages] = useState<string[]>([])
    const [uploadPath, setUploadPath] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session || !session.user) {
                alert('did not find authenticated user')
            } else {
                setUser(session.user)
            }
        }
        fetchUser()
    }, [])

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                const { data, error } = await supabase.storage
                    .from('tmp')
                    .download(path)
                console.log(uploadPath, data, error)
                if (error) {
                    throw error
                }
                const url = URL.createObjectURL(data)
                setDisplayImages(prevDisplayImages => [...prevDisplayImages, url])
            } catch (error) {
                alert(`Error downloading image ${error}`)
            }
        }

        if (uploadPath)
            downloadImage(uploadPath)

    }, [uploadPath])

    const uploadTempCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${user?.id}/${Math.random()}.${fileExt}`

            const { data, error } = await supabase.storage.from('tmp').upload(filePath, file)

            if (error) {
                throw Error(`${error}`)
            }
            setUploadPath(filePath)
        } catch (e: any) {
            alert(`Error uploading image!`)
        } finally {
            setUploading(false)
        }
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageDelete = (imageIndex: number) => {
        setDisplayImages(displayImages.filter((_, index) => index !== imageIndex));
    }

    return (
        <div className='my-4 flex flex-col space-y-4'>
            <div id='upload-part' className='flex flex-row justify-start items-center space-x-2 text-foreground/50 text-sm font-mono font-sm font-medium'>
                <div>
                    <Bubble element={`${displayImages.length}/10`} />
                </div>
                {!uploading ? <AiOutlineCloudUpload className="cursor-pointer" size={30} onClick={handleButtonClick} />
                    : <div className='w-6 h-6 border-t-4 border-foreground/50 border-opacity-80 rounded-full animate-spin' />}
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={uploadTempCover}
                    disabled={uploading || displayImages.length === 10}
                />
            </div>
            <div id='image-display' className="flex flex-row space-x-2 overflow-x-auto">
                {displayImages.map((image_link, index) =>
                    <div key={index} className="h-56 flex-shrink-0 relative">
                        <img
                            src={image_link}
                            alt="Placeholder Image"
                            className="h-full w-auto"
                        />
                        <button
                            onClick={() => handleImageDelete(index)}
                            className="absolute top-5 right-5 bg-foreground text-background rounded-full w-5 h-5 flex items-center justify-center opacity-70 p-1"
                            style={{ transform: 'translate(50%,-50%)' }}
                        >
                            <ImCross />
                        </button>
                    </div>
                )}
            </div>
        </div>)

}