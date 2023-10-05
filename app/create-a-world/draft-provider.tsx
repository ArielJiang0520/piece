'use client'
import React, { createContext, useState, useEffect, useContext } from 'react';
import { World, DefaultWorld, Tag, TagCategory } from '@/types/types';
import { useSupabase } from '@/app/supabase-provider';
import { delete_world } from '@/utils/world-helpers';
import { useSearchParams } from 'next/navigation';
import { getId } from '@/utils/helpers';
import { fetch_all_tags, fetch_all_tags_categories } from '@/utils/data-helpers';

interface DraftContextData {
    currentDraft: World | DefaultWorld;
    handleDraftChange: (selectedOption: any) => void;
    handleDraftDelete: (selectedOption: any) => void;
    drafts: Array<World | DefaultWorld>;
    fetchDrafts: () => Promise<void>;
    tags: Tag[],
    categories: TagCategory[]
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
    const [tags, setTags] = useState<Tag[]>([])
    const [categories, setCategories] = useState<TagCategory[]>([])

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

    const fetchData = async () => {
        setTags(await fetch_all_tags());
        setCategories(await fetch_all_tags_categories());
    }


    useEffect(() => {
        if (edit_id) {
            fetchWorld();
        } else {
            fetchDrafts();
        }
        fetchData();
    }, []);


    return (
        <DraftContext.Provider value={{ tags, categories, currentDraft, handleDraftChange, handleDraftDelete, drafts, fetchDrafts }}>
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