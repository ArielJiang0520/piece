'use client'
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Piece, DefaultPiece } from '@/types/types';
import { useSupabase } from '@/app/supabase-provider';
import { delete_world } from '@/utils/world-helpers';
import { useSearchParams } from 'next/navigation';
import { getId } from '@/utils/helpers';

interface DraftContextData {
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

    const [currentDraft, setCurrentDraft] = useState<Piece | DefaultPiece>(initDraft);
    const [drafts, setDrafts] = useState<Array<Piece | DefaultPiece>>([initDraft]);
    const { supabase } = useSupabase();

    const handleDraftChange = (selectedOption: any) => {
        setCurrentDraft(selectedOption)
    }

    const handleDraftDelete = async (selectedOption: any) => {
        if (!('default' in selectedOption)) {
            const status = await delete_world(selectedOption.id)
            await fetchDrafts();
        }
    }

    const fetchDrafts = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
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
    }

    const fetchPiece = async () => {
        const { data, error } = await supabase
            .from('pieces')
            .select('*')
            .eq('id', edit_id)
            .single()
        if (error || !data) {
            console.error(error.code, error.message)
            return
        }
        setCurrentDraft(data)
        console.log('currentDraft', currentDraft)
    }

    useEffect(() => {
        if (edit_id)
            fetchPiece();
        else
            fetchDrafts();
    }, []);


    return (
        <DraftContext.Provider value={{ currentDraft, handleDraftChange, handleDraftDelete, drafts, fetchDrafts }}>
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