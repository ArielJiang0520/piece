'use client'
import { useState, useEffect } from 'react';
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import { useSupabase } from '@/app/supabase-provider';
import { NavBarSwitchLink } from '@/components/ui/switch-tab/switch-tab';


interface LocalNavBarProps {
    world_id: string;
}
export default function LocalNavBar({ world_id }: LocalNavBarProps) {
    const { supabase } = useSupabase()
    const [world, setWorld] = useState<string | null>(null)

    const tabs = [
        { name: 'Overview', link: `/world/${world_id}` },
        { name: 'Pieces', link: `/world/${world_id}/pieces` },
        { name: 'Discussions', link: `/world/${world_id}/discussions` },
    ];

    const PageTitleNavBarComponent = () => {
        return <NavBarHeader title={"world"} subtitle={world} />
    }

    const fetchWorld = async () => {
        const { data, error } = await supabase
            .from('worlds')
            .select('world_name')
            .eq('id', world_id)
        if (error || !data || data.length != 1)
            alert(error)
        else
            setWorld(data[0].world_name)
    };

    useEffect(() => {
        fetchWorld();
    }, [])



    const LocalNavBarComponent = () => {

        return <NavBarSwitchLink tabs={tabs} />
    }

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}