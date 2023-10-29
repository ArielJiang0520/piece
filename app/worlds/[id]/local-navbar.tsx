'use client'
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import { NavBarSwitchLink } from '@/components/ui/navbar/navbar-helpers';
import { World } from '@/types/types';
import Skeleton from 'react-loading-skeleton';
import { WorldMetadata } from '@/app/supabase-server';
import { AtomIcon, CommentIcon, CreateIcon, OpenBookIcon, PencilIcon } from '@/components/icon/icon';
import { useEffect, useState } from 'react';
import { fetch_num_of_pieces, fetch_num_of_prompts } from '@/utils/piece-helpers';

interface LocalNavBarProps {
    world: WorldMetadata | World;

}

export default function LocalNavBar({ world, }: LocalNavBarProps) {


    if (!world) {
        return <><Skeleton count={3} /></>
    }

    const PageTitleNavBarComponent = () => {
        return <NavBarHeader title={"world"} subtitle={world?.name} />
    }

    const LocalNavBarComponent = () => {
        const [numPieces, setNumPieces] = useState(0)
        const [numPrompts, setNumPrompts] = useState(0)
        const fetchNumPieces = async () => {
            setNumPieces(await fetch_num_of_pieces(world.id));
        }
        const fetchNumPrompts = async () => {
            setNumPrompts(await fetch_num_of_prompts(world.id));
        }

        const tabs = [
            { name: 'Overview', link: `/worlds/${world.id}`, bubble: null, icon: <OpenBookIcon /> },
            { name: 'Pieces', link: `/worlds/${world.id}/pieces`, bubble: numPieces, icon: <CreateIcon /> },
            { name: 'Prompts', link: `/worlds/${world.id}/prompts`, bubble: numPrompts, icon: <CommentIcon /> },
            { name: 'Explore in AI', link: `/worlds/${world.id}/explore`, bubble: null }
        ];

        useEffect(() => {
            fetchNumPieces();
            fetchNumPrompts();
        }, [])

        return <NavBarSwitchLink tabs={tabs} pinned={true} />
    }

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}