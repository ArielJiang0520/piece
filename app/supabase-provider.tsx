'use client';
import type { Database } from '@/types/supabase';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

type SupabaseContext = {
    supabase: SupabaseClient<Database>;
    user: User | null
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const [supabase] = useState(() => createPagesBrowserClient());
    const [user, setUser] = useState<User | null>(null);
    const fetchUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user === undefined ? null : session.user)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <Context.Provider value={{ supabase, user }}>
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