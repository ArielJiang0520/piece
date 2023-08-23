'use client'
import { useState, useEffect } from 'react';
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import { useSupabase } from '@/app/supabase-provider';
import { NavBarSwitchLink } from '@/components/ui/menu/switch-tab';
import PeekWorld from '@/components/ui/display/World/PeekWorld';
import { World } from '@/types/types';
import Skeleton from 'react-loading-skeleton';

interface LocalNavBarProps {
    world_id: string;
}

export default function LocalNavBar({ world_id }: LocalNavBarProps) {
    const { supabase } = useSupabase()
    const [world, setWorld] = useState<World | null>(null)
    const tabs = [
        { name: 'Overview', link: `/worlds/${world_id}` },
        { name: 'Pieces', link: `/worlds/${world_id}/pieces` },
        { name: 'Explore in AI', link: `/worlds/${world_id}/explore` }
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
        return <NavBarHeader title={"world"} subtitle={world?.name} icon={<PeekWorld world={world} iconOnly={true} />} />
    }

    const LocalNavBarComponent = () => {
        return <NavBarSwitchLink tabs={tabs} pinned={true} />
    }

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}