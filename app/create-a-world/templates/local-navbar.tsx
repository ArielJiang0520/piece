'use client'
import { useState, useEffect } from 'react';
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import { useSupabase } from '@/app/supabase-provider';
import { NavBarSwitchLink } from '@/components/ui/navbar/navbar-helpers';

export default function LocalNavBar() {


    const PageTitleNavBarComponent = () => {
        return <NavBarHeader title={"create-a-world"} subtitle={"Viewing Templates"} />
    }



    const LocalNavBarComponent = null;

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}