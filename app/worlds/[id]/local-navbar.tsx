'use client'
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import { NavBarSwitchLink } from '@/components/ui/navbar/navbar-helpers';
import { World } from '@/types/types';
import Skeleton from 'react-loading-skeleton';
import { WorldMetadata } from '@/app/supabase-server';
import { AtomIcon, OpenBookIcon, PencilIcon } from '@/components/icon/icon';

interface LocalNavBarProps {
    world: WorldMetadata | World;
    numPieces: number;
}

export default function LocalNavBar({ world, numPieces }: LocalNavBarProps) {
    const tabs = [
        { name: 'Synopsis', link: `/worlds/${world.id}`, bubble: null, icon: <OpenBookIcon /> },
        { name: 'Pieces', link: `/worlds/${world.id}/pieces`, bubble: numPieces, icon: <AtomIcon /> },
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