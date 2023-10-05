'use client';
import type { Database } from '@/types/supabase';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Tag } from '@/types/types';
import { fetch_all_tags } from '@/utils/data-helpers';

type SupabaseContext = {
    supabase: SupabaseClient<Database>;
    user: User | null;
    tagMap: Record<string, string>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const [supabase] = useState(() => createPagesBrowserClient());
    const [user, setUser] = useState<User | null>(null);
    const [tagMap, setTagMap] = useState<Record<string, string>>({});

    const fetchUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user === undefined ? null : session.user)
    }

    const fetchTags = async () => {
        const tagList = await fetch_all_tags();
        setTagMap(tagList.reduce((obj, tag) => {
            return {
                ...obj,
                [tag.id]: tag.name
            };
        }, {}))
    }

    useEffect(() => {
        fetchUser();
        fetchTags();
    }, [])

    return (
        <Context.Provider value={{ supabase, user, tagMap }}>
            <>{children}</>
        </Context.Provider>
    );
}

export const useSupabase = () => {
    const context = useContext(Context);

    if (context === undefined) {
        throw new Error('useSupabase must be used inside SupabaseProvider');
    }

    return context;
};