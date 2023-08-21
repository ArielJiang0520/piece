'use client'
import React, { createContext, useState, useEffect, useContext } from 'react';
import { World, DefaultWorld } from '@/types/types.world';
import { useSupabase } from '@/app/supabase-provider';
import { delete_world } from '@/utils/world-helpers';
import { useSearchParams } from 'next/navigation';
import { getId } from '@/utils/helpers';

interface DraftContextData {
    currentDraft: World | DefaultWorld;
    handleDraftChange: (selectedOption: any) => void;
    handleDraftDelete: (selectedOption: any) => void;
    drafts: Array<World | DefaultWorld>;
    fetchDrafts: () => Promise<void>;
}

export const DraftContext = createContext<DraftContextData | undefined>(undefined);

export function DraftProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const searchParams = useSearchParams()
    const edit_id = searchParams.get("edit_id")

    const initDraft = { id: `W-${getId()}`, name: 'A New Draft', default: true } as DefaultWorld;

    const [currentDraft, setCurrentDraft] = useState<World | DefaultWorld>(initDraft);
    const [drafts, setDrafts] = useState<Array<World | DefaultWorld>>([initDraft]);
    const { supabase } = useSupabase();

    const handleDraftChange = (selectedOption: any) => {
        setCurrentDraft(selectedOption)
    }

    const handleDraftDelete = async (selectedOption: any) => {
        if (selectedOption.default) {
            return
        } else {
            delete_world(selectedOption.id)
        }
    }

    const fetchDrafts = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            console.error('did not find authenticated user')
            return
        }

        const { data, error } = await supabase
            .from('worlds')
            .select()
            .eq('creator_id', session.user.id)
            .eq('is_draft', true)

        if (error) {
            console.error(error.code, error.message)
            return
        }
        setDrafts([initDraft, ...data]);
    }

    const fetchWorld = async () => {
        const { data, error } = await supabase
            .from('worlds')
            .select()
            .eq('id', edit_id)
            .limit(1)
            .single()

        if (error) {
            console.error(error.code, error.message)
            return
        }
        setCurrentDraft(data);
    }

    useEffect(() => {
        if (edit_id) {
            fetchWorld();
        } else {
            fetchDrafts();
        }
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