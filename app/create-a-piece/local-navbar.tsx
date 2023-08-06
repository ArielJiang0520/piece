'use client'
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import { NavBarSwitchTab } from '@/components/ui/switch-tab/switch-tab';
import { usePieceContext } from './piece-provider';

export default function LocalNavBar() {

    const PageTitleNavBarComponent = () => {
        const { world } = usePieceContext();
        if (!world)
            return <NavBarHeader title={"create-a-piece"} subtitle={"Loading..."} />
        return (
            <NavBarHeader title={"create-a-piece"} subtitle={world.world_name} />
        )
    }

    const LocalNavBarComponent = () => {
        const { updateInputType } = usePieceContext()
        const tabs = ['text', 'media'];
        return <NavBarSwitchTab tabs={tabs} onChange={(index) => { updateInputType(tabs[index]) }} />
    }

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}