'use client'
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import PeekWorld from '@/components/ui/display/World/PeekWorld';
import { Piece, World } from '@/types/types';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';

interface LocalNavBarProps {
    piece: Piece;
    world: World
}
export default function LocalNavBar({ piece, world }: LocalNavBarProps) {
    const PageTitleNavBarComponent = () => {
        return <NavBarHeader title={"piece"} subtitle={piece?.name === '' ? 'Untitled' : piece.name} />
    }

    const LocalNavBarComponent = null;

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}