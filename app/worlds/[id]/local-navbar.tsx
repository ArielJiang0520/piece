'use client'
import { useState, useEffect } from 'react';
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import { useSupabase } from '@/app/supabase-provider';
import { NavBarSwitchLink } from '@/components/ui/navbar/navbar-helpers';
import PeekWorld from '@/components/ui/display/World/PeekWorld';
import { JoinedWorldAll, World } from '@/types/types';
import Skeleton from 'react-loading-skeleton';
import { usePathname } from 'next/navigation';
import { fetch_num_of_pieces } from '@/utils/world-helpers';

interface LocalNavBarProps {
    world: JoinedWorldAll;
}

export default function LocalNavBar({ world }: LocalNavBarProps) {
    const { supabase } = useSupabase()
    // const [world, setWorld] = useState<World | null>(null)
    // const [numPieces, setNumPieces] = useState<number>(0)

    // const fetchWorld = async () => {
    //     const { data, error } = await supabase
    //         .from('worlds')
    //         .select('*')
    //         .eq('id', world_id)
    //         .single()
    //     if (error || !data)
    //         alert(error)
    //     else
    //         setWorld(data)
    // };

    // useEffect(() => {
    //     const fetchNumPieces = async () => setNumPieces(await fetch_num_of_pieces(world_id))
    //     fetchWorld();
    //     fetchNumPieces();
    // }, [])

    const tabs = [
        { name: 'Overview', link: `/worlds/${world.id}`, bubble: null },
        { name: 'Pieces', link: `/worlds/${world.id}/pieces`, bubble: world.pieces[0].count },
        { name: 'Explore in AI', link: `/worlds/${world.id}/explore`, bubble: null }
    ];

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