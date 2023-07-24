'use client'
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Draft } from '@/types/types.world';
import { useSupabase } from '@/app/supabase-provider';

interface DraftContextData {
    currentDraft: Draft | null;
    handleDraftChange: (selectedOption: any) => void;
    drafts: Draft[];
    updateDrafts: () => Promise<void>;
}

export const DraftContext = createContext<DraftContextData | undefined>(undefined);

export function DraftProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const [currentDraft, setCurrentDraft] = useState<Draft | null>(null);
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const { supabase } = useSupabase();

    const handleDraftChange = (selectedOption: any) => {
        if (selectedOption.id === 'default') {
            setCurrentDraft(null)
        } else {
            setCurrentDraft(selectedOption)
        }
    }

    const updateDrafts = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            console.error('did not find authenticated user')
            return
        }

        const { data, error } = await supabase
            .from('drafts')
            .select()
            .eq('creator_id', session.user.id)

        if (error) {
            console.error(error.code, error.message)
            return
        }

        setDrafts(data);
    }

    useEffect(() => {
        updateDrafts();
    }, []);

    return (
        <DraftContext.Provider value={{ currentDraft, handleDraftChange, drafts, updateDrafts }}>
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