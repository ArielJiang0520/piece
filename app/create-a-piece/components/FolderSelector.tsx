'use client'
import DropDownSelector from '@/components/ui/input/DropDownSelector';
import { Folder, DefaultFolder } from '@/types/types';
import { useState } from 'react';

interface FolderSelectorProps {
    folders: Array<Folder | DefaultFolder>,
}

export default function FolderSelector({ folders }: FolderSelectorProps) {
    const [selected, setSelected] = useState<Folder | DefaultFolder>(folders[0]);

    return <DropDownSelector
        data={folders}
        width='w-80'
        nameKey="folder_name"
        selected={selected}
        setSelected={setSelected}
    />
}