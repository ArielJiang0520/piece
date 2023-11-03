'use client'
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import PeekWorld from '@/components/ui/display/World/PeekWorld';
import { Piece, Prompt, World } from '@/types/types';
import { WorldMetadata } from '@/app/supabase-server';

interface LocalNavBarProps {
    prompt: Prompt;
    world: WorldMetadata;
}
export default function LocalNavBar({ prompt, world }: LocalNavBarProps) {
    const PageTitleNavBarComponent = () => {
        return <NavBarHeader title={"prompt"} subtitle={prompt.prompt} icon={<PeekWorld world={world} iconOnly={true} />} />
    }

    const LocalNavBarComponent = null;

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}