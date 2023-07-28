'use client'
import { useEffect, useState, useRef } from 'react';
import { UploadIcon, CloseIcon } from '@/components/icon/icon';
import { v4 as uuidv4 } from 'uuid';
import { Bubble } from '@/components/ui/widget/bubble';
import { useSupabase } from '@/app/supabase-provider';
import type { User } from '@supabase/supabase-js';

import { useFormikContext } from 'formik';
import LazyImage from '@/components/ui/display/LazyImage';

interface CoversUploadProps {
    user: User | null;
    initPaths: string[];
}

export default function CoversUpload({ user, initPaths }: CoversUploadProps) {
    const { setFieldValue } = useFormikContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { supabase } = useSupabase();
    const [paths, setPaths] = useState<string[]>(initPaths);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setFieldValue('images', paths);
    }, [paths, setFieldValue]);

    useEffect(() => {
        setPaths(initPaths)
    }, [initPaths])

    const uploadTempCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setUploading(true);
        try {
            if (!user || !user.id)
                throw (`No authenticated user found!`);

            const file = event.target.files![0];
            const fileExt = file.name.split('.').pop();
            const filePath = `tmp/${user.id}/${uuidv4()}.${fileExt}`;

            const { error } = await supabase.storage.from('world').upload(filePath, file);
            if (error) {
                throw (`Error uploading image: ${error}`);
            } else {
                setPaths((prevPaths) => [...prevPaths, filePath]);
            }
        } catch (error) {
            alert(`Error uploading image: ${error}`);
        } finally {
            setUploading(false);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageDelete = (imageIndex: number) => {
        setPaths((prevPaths) => prevPaths.filter((_, index) => index !== imageIndex));
    };

    return (
        <div className='my-4 flex flex-col space-y-4'>
            <div id='upload-part' className='flex flex-row justify-start items-center space-x-2 text-foreground/50 text-sm font-mono font-sm font-medium'>
                <div>
                    <Bubble element={`${paths.length}/10`} />
                </div>
                {!uploading ?
                    <UploadIcon className="cursor-pointer" size={30} onClick={handleButtonClick} />
                    : <div className='w-6 h-6 border-t-4 border-foreground/50 border-opacity-80 rounded-full animate-spin' />
                }
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={uploadTempCover}
                    disabled={uploading || paths.length === 10}
                />
            </div>
            <div id='image-display' className="flex flex-row space-x-2 overflow-x-auto">
                {paths.map((path, index) =>
                    <div key={index} className="h-56 flex-shrink-0 relative">
                        <LazyImage bucket="world" path={path} dimension="h-56 w-56" />
                        <button
                            onClick={() => handleImageDelete(index)}
                            type="button"
                            className="absolute top-5 right-5 bg-foreground text-background rounded-full w-5 h-5 flex items-center justify-center opacity-70 p-1"
                            style={{ transform: 'translate(50%,-50%)' }}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}