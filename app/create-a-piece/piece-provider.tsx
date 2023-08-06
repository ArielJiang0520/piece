'use client'
import React, { createContext, Dispatch, SetStateAction, useState, useEffect, useContext } from 'react';
import type { Folder, World, DefaultFolder } from '@/types/types.world';
import { useSupabase } from '@/app/supabase-provider';
import { useSearchParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';




interface PieceContextData {
    piece_id: string,
    inputType: string;
    updateInputType: Dispatch<SetStateAction<string>>;
    world: World | null;
    folders: Array<Folder | DefaultFolder>;
}

export const PieceContext = createContext<PieceContextData | undefined>(undefined);

export function PieceProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const initFolder = { id: uuidv4(), folder_name: 'A New Folder', default: true } as DefaultFolder;

    const searchParams = useSearchParams()
    const world_id = searchParams.get('id')

    const piece_id = uuidv4();

    const [currentInputType, setCurrentInputType] = useState<string>('text');
    const [world, setWorld] = useState<World | null>(null)
    const [folders, setFolders] = useState<Array<Folder | DefaultFolder>>([initFolder])
    const { supabase, user } = useSupabase();

    const fetchWorld = async () => {
        const { data, error } = await supabase
            .from('worlds')
            .select()
            .eq('id', world_id)

        if (error || !data || data.length != 1)
            console.error(error)
        else
            setWorld(data[0])
    };

    const fetchFolders = async () => {
        if (!user || !world)
            return

        const { data, error } = await supabase
            .from('folders')
            .select()
            .eq('creator_id', user.id)
            .eq('world_id', world.id)

        if (error || !data)
            console.error(error)
        else
            setFolders([initFolder, ...data])
    };

    useEffect(() => {
        fetchWorld();
        fetchFolders();
    }, []);


    return (
        <PieceContext.Provider value={{ piece_id, inputType: currentInputType, updateInputType: setCurrentInputType, world, folders }}>
            {children}
        </PieceContext.Provider>
    );
};

export function usePieceContext() {
    const context = useContext(PieceContext);
    if (context === undefined) {
        throw new Error('usePieceContext must be used within a PieceProvider');
    }
    return context;
}