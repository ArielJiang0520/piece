'use client'
import { useState, useEffect } from 'react';
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import { useSupabase } from '@/app/supabase-provider';
import { NavBarSwitchLink } from '@/components/ui/navbar/navbar-helpers';


interface LocalNavBarProps {
    profile_id: string;
}
export default function LocalNavBar() {


    const PageTitleNavBarComponent = () => {
        return <NavBarHeader title={"browsing"} subtitle={"All Modifiers"} />
    }



    const LocalNavBarComponent = null;

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}