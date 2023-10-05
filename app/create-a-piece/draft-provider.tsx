'use client'
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Piece, DefaultPiece } from '@/types/types';
import { useSupabase } from '@/app/supabase-provider';
import { delete_world } from '@/utils/world-helpers';
import { useSearchParams } from 'next/navigation';
import { getId } from '@/utils/helpers';
import { WorldMetadata } from '../supabase-server';

interface DraftContextData {
    world: WorldMetadata | null;
    currentDraft: Piece | DefaultPiece;
    handleDraftChange: (selectedOption: any) => void;
    handleDraftDelete: (selectedOption: any) => void;
    drafts: Array<Piece | DefaultPiece>;
    fetchDrafts: () => Promise<void>;
}

export const DraftContext = createContext<DraftContextData | undefined>(undefined);

export function DraftProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const searchParams = useSearchParams()
    const world_id = searchParams.get('world_id')
    const edit_id = searchParams.get("edit_id")

    const initDraft = { id: `P-${getId()}`, name: 'A New Draft', default: true } as DefaultPiece;
    const [world, setWorld] = useState<WorldMetadata | null>(null)
    const [currentDraft, setCurrentDraft] = useState<Piece | DefaultPiece>(initDraft);
    const [drafts, setDrafts] = useState<Array<Piece | DefaultPiece>>([initDraft]);
    const { supabase } = useSupabase();

    const handleDraftChange = (selectedOption: any) => {
        setCurrentDraft(selectedOption)
    }

    const handleDraftDelete = async (selectedOption: any) => {
        if (!('default' in selectedOption)) {
            await delete_world(selectedOption.id)
            await fetchDrafts();
        }
    }

    async function getWorldMetadata(id: string): Promise<WorldMetadata> {
        const { data, error } = await supabase
            .from('worlds')
            .select('*, profiles(*), pieces(count), subscriptions(count)')
            .eq('id', id)
            .limit(1)
            .single();
        if (!data || error)
            throw Error(JSON.stringify(error))
        return data as WorldMetadata
    }

    const fetchDrafts = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session || !world_id) {
            console.error('did not find authenticated user')
            return
        }

        const { data, error } = await supabase
            .from('pieces')
            .select('*')
            .eq('world_id', world_id)
            .eq('creator_id', session.user.id)
            .eq('is_draft', true)

        if (error) {
            console.error(error.code, error.message)
            return
        }
        setDrafts([initDraft, ...data]);
        setWorld(await getWorldMetadata(world_id))
    }

    const fetchPiece = async () => {
        const { data, error } = await supabase
            .from('pieces')
            .select('*')
            .eq('id', edit_id)
            .single()
        if (error || !data) {
            throw Error(JSON.stringify(error))
        }
        setCurrentDraft(data)
        setWorld(await getWorldMetadata(data.world_id!))
    }

    useEffect(() => {
        if (edit_id) {
            fetchPiece();
        }
        else if (world_id) {
            fetchDrafts();
        }
    }, [searchParams]);


    return (
        <DraftContext.Provider value={{ world, currentDraft, handleDraftChange, handleDraftDelete, drafts, fetchDrafts }}>
            {children}
        </DraftContext.Provider>
    );
};

export function useDraftContext() {
    const context = useContext(DraftContext);
    if (context === undefined) {
        throw new Error('useDraftContext must be used within a DraftProvider');
    }
    return context;
}