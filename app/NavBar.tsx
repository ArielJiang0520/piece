'use client'
import Link from 'next/link'
import { ComponentType, useEffect, useState } from 'react'
import { BurgerIcon } from '@/components/icon/icon'
import { SideBar } from '@/components/ui/navbar/navbar-helpers'
import Image from 'next/image'
import { useSupabase } from './supabase-provider'

interface NavBarProps {
    PageTitleNavBarComponent: ComponentType<any>;
    LocalNavBarComponent: ComponentType<any> | null;
    [key: string]: any;
}

export default function NavBar({ PageTitleNavBarComponent, LocalNavBarComponent, ...props }: NavBarProps) {
    const { user } = useSupabase()
    const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
    const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);


    const menuItems = [
        {
            link: '/',
            name: 'Feed'
        },

        {
            link: '/worlds',
            name: 'Browse Worlds'
        },

        {
            link: '/create-a-world/templates',
            name: 'Create A World'
        },
    ]

    const profileItems: any[] = [
        {
            link: `/profiles/${user?.id}`,
            name: 'Profile'
        },

        {
            link: `/profiles/${user?.id}/worlds`,
            name: 'Your worlds'
        },

    ]


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

            <SideBar onLeft={false} isMenuOpen={isRightMenuOpen} setIsMenuOpen={setIsRightMenuOpen} menuItems={profileItems} image={{ link: user && user.user_metadata && user.user_metadata.picture ? user.user_metadata.picture : '/logo_500px.png', alt: "profile picture" }} />
        </>
    )

}
