'use client'
import { useState, useEffect } from 'react';
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import { useSupabase } from '@/app/supabase-provider';
import { NavBarSwitchLink } from '@/components/ui/switch-tab/switch-tab';
import PeekWorld from '@/components/ui/display/World/PeekWorld';
import { World } from '@/types/types.world';
import Skeleton from 'react-loading-skeleton';
interface LocalNavBarProps {
    world_id: string;
}
export default function LocalNavBar({ world_id }: LocalNavBarProps) {
    const { supabase } = useSupabase()
    const [world, setWorld] = useState<World | null>(null)
    const tabs = [
        { name: 'Overview', link: `/world/${world_id}` },
        { name: 'Pieces', link: `/world/${world_id}/pieces` },
        { name: 'Explore in AI', link: `/world/${world_id}/explore` }
    ];


    const fetchWorld = async () => {
        const { data, error } = await supabase
            .from('worlds')
            .select('*')
            .eq('id', world_id)
            .limit(1)
            .single()
        if (error || !data)
            alert(error)
        else
            setWorld(data)
    };

    useEffect(() => {
        fetchWorld();
    }, [])

    if (!world) {
        return <><Skeleton count={3} /></>
    }

    const PageTitleNavBarComponent = () => {
        return <NavBarHeader title={"world"} subtitle={world?.world_name} icon={<PeekWorld world={world} iconOnly={true} />} />
    }

    const LocalNavBarComponent = () => {
        return <NavBarSwitchLink tabs={tabs} pinned={true} />
    }

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}