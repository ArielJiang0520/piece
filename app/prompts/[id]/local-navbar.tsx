'use client'
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import PeekWorld from '@/components/ui/display/World/PeekWorld';
import { Piece, Prompt, World } from '@/types/types';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';

interface LocalNavBarProps {
    prompt: Prompt;
}
export default function LocalNavBar({ prompt }: LocalNavBarProps) {
    const PageTitleNavBarComponent = () => {
        return <NavBarHeader title={"prompt"} subtitle={prompt.prompt} />
    }

    const LocalNavBarComponent = null;

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}