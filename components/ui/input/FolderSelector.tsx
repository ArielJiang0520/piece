'use client'
import DropDownSelector from '@/components/ui/input/DropDownSelector';
import { Folder, DefaultFolder, World, PiecePayload, TypedPiece } from '@/types/types';
import { useEffect, useState } from 'react';
import { fetch_all_folders } from '@/utils/folder-helpers';
import { useFormikContext } from 'formik';

interface FolderSelectorProps {
    wid: string,
}

const defaultList = [{ id: 'default', name: 'All' } as DefaultFolder]

export default function FolderSelector({ wid }: FolderSelectorProps) {
    const { setFieldValue, values } = useFormikContext<TypedPiece | PiecePayload>();
    const [folders, setFolders] = useState<Array<Folder | DefaultFolder>>(defaultList)
    const [selected, setSelected] = useState<Folder | DefaultFolder>(defaultList[0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const retrievedFolders = await fetch_all_folders(wid);
            setFolders([...defaultList, ...retrievedFolders]);
            setSelected(retrievedFolders.find(folder => folder.id === values.folder_id) || defaultList[0]);
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        setFieldValue('folder_id', selected && selected.id !== 'default' ? selected.id : null);
    }, [selected]);

    if (loading) {
        return null; // or your loading UI
    }

    return (
        <DropDownSelector
            data={folders}
            width='w-80'
            nameKey="name"
            selected={selected}
            setSelected={setSelected}
        />
    );
}