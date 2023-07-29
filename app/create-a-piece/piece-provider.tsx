'use client'
import React, { createContext, Dispatch, SetStateAction, useState, useEffect, useContext } from 'react';
import type { World } from '@/types/types.world';
import { useSupabase } from '@/app/supabase-provider';
import { useSearchParams } from 'next/navigation'

interface PieceContextData {
    inputType: "text" | "media";
    updateInputType: Dispatch<SetStateAction<"text" | "media">>;
    world: World | null;
}

export const PieceContext = createContext<PieceContextData | undefined>(undefined);

export function PieceProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const searchParams = useSearchParams()
    const world_id = searchParams.get('id')

    const [currentInputType, setCurrentInputType] = useState<"text" | "media">('text');
    const [world, setWorld] = useState<World | null>(null)
    const { supabase } = useSupabase();

    const fetchWorld = async () => {
        console.log(world_id)

        const { data, error } = await supabase
            .from('worlds')
            .select()
            .eq('id', world_id)

        if (error || !data || data.length != 1)
            console.error(error)
        else
            setWorld(data[0])
    };

    useEffect(() => {
        fetchWorld();
    }, []);


    return (
        <PieceContext.Provider value={{ inputType: currentInputType, updateInputType: setCurrentInputType, world: world }}>
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