'use client'
// create-a-world
import { LocalNavBar } from './LocalBar';
import CaW from './CaW'
import { useEffect, useMemo, useState } from 'react'
import { useSupabase } from '@/app/supabase-provider';
import { DraftProvider } from './draft-provider';

export default function Page() {
    const { supabase } = useSupabase()
    const [userDrafts, setUserDrafts] = useState([] as any[])

    useEffect(() => {
        const fetchUserDrafts = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()

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
            setUserDrafts(data)
        }
        fetchUserDrafts()

    }, [])

    const defaultOption = { id: 'default', name: 'A New Draft' };
    const allData = useMemo(() => [defaultOption, ...userDrafts], [userDrafts]);

    return (
        <DraftProvider>
            <LocalNavBar allData={allData} />
            <div className="w-full md:w-2/3 flex flex-col gap-20 px-5 py-5 lg:py-5 text-foreground font-mono">
                <CaW />
            </div>
        </DraftProvider>
    )
}
