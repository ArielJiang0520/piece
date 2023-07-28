'use client'
import { useEffect, useState, useRef } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { Bubble } from '@/components/ui/widget/bubble';
import { useSupabase } from '@/app/supabase-provider';
import type { User } from '@supabase/supabase-js';
import { ImCross } from 'react-icons/im';
import { useFormikContext } from 'formik';
import { downloadImage } from '@/utils/image-helpers';

export default function CoversUpload({ user, initPaths }: { user: User | null, initPaths: string[] }) {
    const { setFieldValue } = useFormikContext();  // Formik context to access its functions
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { supabase } = useSupabase()
    const [images, setImages] = useState<{ path: string, displayUrl: string }[]>([])
    const [uploadPath, setUploadPath] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        setImages([])
        const downloadAllImages = async () => {
            try {
                const imagePromises = initPaths.map(async path => {
                    const url = await downloadImage(path);
                    return { path: path, displayUrl: url };
                });

                const images = await Promise.all(imagePromises);
                setImages(images);
            } catch (error) {
                alert(error);
            }
        };

        downloadAllImages();
    }, [initPaths])

    useEffect(() => {
        setFieldValue('images', images.map(imgObj => imgObj.path))
    }, [images])

    useEffect(() => {
        if (uploadPath) {
            downloadImage(uploadPath)
                .then(url => {
                    setImages(prevImages => [...prevImages, { path: uploadPath, displayUrl: url }])
                    setUploadPath(null)
                })
                .catch(error => alert(error))
        }
    }, [uploadPath])

    const uploadTempCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) {
                return
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${user?.id}/tmp/${Math.random()}.${fileExt}`

            const { error } = await supabase
                .storage
                .from('world')
                .upload(filePath, file)

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
        setImages(images.filter((_, index) => index !== imageIndex));
    }

    return (
        <div className='my-4 flex flex-col space-y-4'>
            <div id='upload-part' className='flex flex-row justify-start items-center space-x-2 text-foreground/50 text-sm font-mono font-sm font-medium'>
                <div>
                    <Bubble element={`${images.length}/10`} />
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
                    disabled={uploading || images.length === 10}
                />
            </div>
            <div id='image-display' className="flex flex-row space-x-2 overflow-x-auto">
                {images.map((imageObj, index) =>
                    <div key={index} className="h-56 flex-shrink-0 relative">
                        <img
                            src={imageObj.displayUrl}
                            alt="Placeholder Image"
                            className="h-full w-auto rounded-xl"
                        />
                        <button
                            onClick={() => handleImageDelete(index)}
                            type="button"
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