'use client'
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import { NavBarSwitchLink } from '@/components/ui/navbar/navbar-helpers';
import { World } from '@/types/types';
import Skeleton from 'react-loading-skeleton';
import { WorldMetadata } from '@/app/supabase-server';

interface LocalNavBarProps {
    world: WorldMetadata | World;
    numPieces: number;
}

export default function LocalNavBar({ world, numPieces }: LocalNavBarProps) {
    const tabs = [
        { name: 'Overview', link: `/worlds/${world.id}`, bubble: null },
        { name: 'Pieces', link: `/worlds/${world.id}/pieces`, bubble: numPieces },
        { name: 'Explore in AI', link: `/worlds/${world.id}/explore`, bubble: null }
    ];

    if (!world) {
        return <><Skeleton count={3} /></>
    }

    const PageTitleNavBarComponent = () => {
        return <NavBarHeader title={"world"} subtitle={world?.name} />
    }

    const LocalNavBarComponent = () => {
        return <NavBarSwitchLink tabs={tabs} pinned={true} />
    }

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}