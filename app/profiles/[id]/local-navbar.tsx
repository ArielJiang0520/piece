'use client'
import { useState, useEffect } from 'react';
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import { useSupabase } from '@/app/supabase-provider';
import { NavBarSwitchLink } from '@/components/ui/menu/switch-tab';


interface LocalNavBarProps {
    profile_id: string;
}
export default function LocalNavBar({ profile_id }: LocalNavBarProps) {
    const { supabase } = useSupabase()
    const [user, setUser] = useState<string | null>(null)

    const tabs = [
        { name: 'Overview', link: `/profiles/${profile_id}` },
        { name: 'Worlds', link: `/profiles/${profile_id}/worlds` },
        { name: 'Pieces', link: `/profiles/${profile_id}/pieces` },
    ];

    const PageTitleNavBarComponent = () => {
        return <NavBarHeader title={"user profile"} subtitle={user} />
    }

    const fetchUser = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', profile_id)
            .limit(1)
            .single()
        if (error || !data)
            alert(error)
        else
            setUser(data.full_name)
    };

    useEffect(() => {
        fetchUser();
    }, [])

    const LocalNavBarComponent = () => {
        return <NavBarSwitchLink tabs={tabs} />
    }

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}