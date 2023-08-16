'use client'
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';

export default function LocalNavBar({ worldName }: { worldName: string | null | undefined }) {

    const PageTitleNavBarComponent = () => {
        return (
            <NavBarHeader title={"create-a-piece"} subtitle={worldName} />
        )
    }

    const LocalNavBarComponent = null;

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}