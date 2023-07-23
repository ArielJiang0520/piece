'use client'
// create-a-world
import { useEffect, useState } from 'react'
import { useSupabase } from '@/app/supabase-provider';

import { cast_to_worldpayload, WorldPayload, Draft } from '@/types/types.world';
import { SelectDraft } from './SelectDraft';
import { LocalNavBar } from './localbar';
import CaW from './CaW'


export default function Page() {
    const { supabase } = useSupabase()
    const [userDrafts, setUserDrafts] = useState([] as any[])
    const [currentDraft, setCurrentDraft] = useState<WorldPayload | null>(null)

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

    function handleDraftChange(selectedOption: any) {
        console.log('handle draft change', selectedOption)
        if (selectedOption.id === 'default') {
            setCurrentDraft(null)
        } else {
            setCurrentDraft(cast_to_worldpayload(selectedOption))
        }
    }

    const defaultOption = { id: 'default', name: 'A New Draft' };
    const allData = [defaultOption, ...userDrafts];


    return (
        <>
            <LocalNavBar />
            <div className="w-full md:w-2/3 flex flex-col gap-20 px-5 py-5 lg:py-5 text-foreground font-mono">
                <SelectDraft data={allData} onDraftChange={handleDraftChange} />
                <CaW currentDraft={currentDraft} />
            </div>
        </>
    )
}
