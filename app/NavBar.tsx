'use client'
import Link from 'next/link'
import { ComponentType, useEffect, useState } from 'react'
import { BookIcon, BurgerIcon, SingleUserIcon } from '@/components/icon/icon'
import { SideBar } from '@/components/ui/navbar/navbar-helpers'
import Image from 'next/image'
import { useSupabase } from './supabase-provider'
import { fetch_all_worlds } from '@/utils/world-helpers'

interface NavBarProps {
    PageTitleNavBarComponent: ComponentType<any>;
    LocalNavBarComponent: ComponentType<any> | null;
    [key: string]: any;
}

interface MenuItem {
    link: string;
    name: string;
    level: number;
    icon: JSX.Element | null;
}
export default function NavBar({ PageTitleNavBarComponent, LocalNavBarComponent, ...props }: NavBarProps) {
    const { user } = useSupabase()
    const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
    const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);


    const menuItems: MenuItem[] = [
        {
            link: '/',
            name: 'Feed',
            level: 0,
            icon: null
        },

        {
            link: '/worlds',
            name: 'Browse Worlds',
            level: 0,
            icon: null
        },

        {
            link: '/create-a-world/templates',
            name: 'Create A World',
            level: 0,
            icon: null
        },

        {
            link: '/modifiers',
            name: 'Modifiers',
            level: 0,
            icon: null
        },

        {
            link: '/generate',
            name: 'Generate',
            level: 0,
            icon: null
        },
    ]

    const [profileItems, setProfileItems] = useState<MenuItem[]>([]);
    const fetchWorlds = async (uid: string) => {
        const worlds = await fetch_all_worlds(uid);
        const initProfileItems: MenuItem[] = [
            {
                link: `/profiles/${uid}`,
                name: 'Profile',
                level: 0,
                icon: <SingleUserIcon />
            },

            {
                link: `/profiles/${uid}/worlds`,
                name: 'Your worlds',
                level: 0,
                icon: <BookIcon />
            },

        ]
        const worldItems: MenuItem[] = worlds.slice(0, 5).map(world => {
            return {
                link: `/worlds/${world.id}`,
                name: `${world.name}`,
                level: 1,
                icon: null
            }
        })
        setProfileItems(
            [...initProfileItems, ...worldItems]
        )
    }

    useEffect(() => {
        if (user) {
            fetchWorlds(user.id);
        }
    }, [user])


    return (
        <>
            <nav id="global-bar" className="w-full flex flex-row justify-between items-center h-12 py-3 top-0 z-100 text-foreground text-base font-mono bg-background">

                <div id="menu-part" className='pl-4 flex-grow-0 flex-shrink-0'>

                    <div className='flex flex-row items-center justify-start'>

                        <div id="burger" className='rounded-lg border p-2 cursor-pointer mr-2' onClick={() => setIsLeftMenuOpen(true)}>
                            <BurgerIcon size={14} />
                        </div>

                        <div id="logo" className='mr-2'>
                            <Image src={'/logo_500px.png'} alt="logo" priority={true} width={32} height={32} />
                        </div>

                    </div>
                </div>

                <div className='overflow-hidden whitespace-nowrap overflow-ellipsis flex-grow flex-shrink'>
                    <PageTitleNavBarComponent {...props} />
                </div>

                <div id="signin-part" className='pr-4 flex-grow-0 flex-shrink-0'>
                    {user ? (
                        <div className="flex items-center">
                            <Image
                                className='cursor-pointer rounded-full'
                                src={user.user_metadata && user.user_metadata.picture ? user.user_metadata.picture : '/logo_500px.png'}
                                alt={"profile picture"}
                                priority={true}
                                width={32} height={32}
                                onClick={() => setIsRightMenuOpen(true)}
                            />
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
                        >
                            Login
                        </Link>
                    )}
                </div>

            </nav>


            {LocalNavBarComponent ? <nav id="localbar" className="w-full border-b h-12  top-12 z-10 bg-background p-0 text-foreground">
                <LocalNavBarComponent {...props} />
            </nav> : <div className='w-full border-b h-3  top-12 z-10 bg-background p-0'></div>}

            <SideBar onLeft={true} isMenuOpen={isLeftMenuOpen} setIsMenuOpen={setIsLeftMenuOpen} menuItems={menuItems} image={{ link: '/logo_500px.png', alt: "logo" }} />

            {user && <SideBar onLeft={false} isMenuOpen={isRightMenuOpen} setIsMenuOpen={setIsRightMenuOpen} menuItems={profileItems} image={{ link: user.user_metadata && user.user_metadata.picture ? user.user_metadata.picture : '/logo_500px.png', alt: "profile picture" }} />}
        </>
    )

}
