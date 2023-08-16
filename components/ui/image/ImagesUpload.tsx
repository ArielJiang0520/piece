'use client'
import { useEffect, useState, useRef } from 'react';
import { UploadIcon } from '@/components/icon/icon';
import { v4 as uuidv4 } from 'uuid';
import { Bubble } from '@/components/ui/widget/bubble';
import { useSupabase } from '@/app/supabase-provider';
import { ImagesDisplayRow } from './ImagesDisplayRow';

interface CoversUploadProps {
    dimension: {
        height: string;
        width: string;
    };
    bucket: string,
    folder: string,
    initPaths: string[];
    maxNum?: number;
    setValues: (arg: any) => void;
}

export function ImagesUpload({ dimension, bucket, folder, initPaths, maxNum = 10, setValues }: CoversUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { supabase } = useSupabase();
    const [paths, setPaths] = useState<string[]>(initPaths);
    const [uploading, setUploading] = useState(false);
    const [uid, setUid] = useState<string | null>(null)

    useEffect(() => {
        setValues(paths);
    }, [paths]);

    useEffect(() => {
        setPaths(initPaths)
    }, [initPaths])

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session || !session.user) {
                alert('did not find authenticated user')
            } else {
                setUid(session.user.id)
            }
        }
        fetchUser()
    }, [])

    if (!uid)
        return <>Loading...</>

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setUploading(true);
        try {
            const file = event.target.files![0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${folder}${uuidv4()}.${fileExt}`;

            const { error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (error) {
                throw (`Error uploading image: ${JSON.stringify(error)}`);
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
                    <Bubble element={`${paths.length}/${maxNum}`} />
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
                    onChange={uploadImage}
                    disabled={uploading || paths.length === maxNum}
                />
            </div>
            <ImagesDisplayRow bucket="world" dimension={dimension} paths={paths} del={{ hasDelete: true, onDelete: (index) => handleImageDelete(index) }} />
        </div>
    );
}