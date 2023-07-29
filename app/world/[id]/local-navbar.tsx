'use client'
import { useState, useEffect } from 'react';
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import type { World } from '@/types/types.world';
import { useSupabase } from '@/app/supabase-provider';
import { NavBarSwitchTab } from '@/components/ui/switch-tab/switch-tab';
interface LocalNavBarProps {
    world_id: string;
}

export default function LocalNavBar({ world_id }: LocalNavBarProps) {
    const { supabase } = useSupabase()
    const [world, setWorld] = useState<string>('')

    const tabs = ['Overview', 'Pieces (100)', 'Discussions (30)'];

    useEffect(() => {
        const fetchWorld = async () => {
            const { data, error } = await supabase
                .from('worlds')
                .select('world_name')
                .eq('id', world_id)
            if (error || !data || data.length != 1)
                console.error()
            else
                setWorld(data[0].world_name)
        };
        fetchWorld();
    }, [])

    const PageTitleNavBarComponent = () => {
        return (
            <NavBarHeader title={"world"} subtitle={world} />
        )
    }

    const LocalNavBarComponent = () => {
        return <NavBarSwitchTab tabs={tabs} />
    }

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}