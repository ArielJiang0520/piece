'use client'
import InputList from '@/components/ui/input/InputBox';
import { Folder, DefaultFolder } from '@/types/types.world';
import { useState } from 'react';

interface FolderSelectorProps {
    folders: Array<Folder | DefaultFolder>,
}

export default function FolderSelector({ folders }: FolderSelectorProps) {
    const [selected, setSelected] = useState<Folder | DefaultFolder>(folders[0]);

    return <InputList
        data={folders}
        width='w-80'
        nameKey="folder_name"
        selected={selected}
        setSelected={setSelected}
    />
}