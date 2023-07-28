'use client'
import Link from 'next/link'
import { ComponentType, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User } from '@supabase/auth-helpers-nextjs'
import { AiOutlineMenu } from 'react-icons/ai'
import { SideBar } from '@/components/ui/navbar/navbar-helpers'
import Image from 'next/image'

interface NavBarProps {
    PageTitleNavBarComponent: ComponentType<any>;
    LocalNavBarComponent: ComponentType<any>;
    [key: string]: any;
}

export default function NavBar({ PageTitleNavBarComponent, LocalNavBarComponent, ...props }: NavBarProps) {
    const supabase = createClientComponentClient()
    const [user, setUser] = useState<User | null>(null)
    const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
    const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);


    const menuItems = [
        {
            link: '/',
            name: 'Home'
        },
        {
            link: '/create-a-world',
            name: 'Create A World'
        },
        {
            link: '/',
            name: 'Browse'
        }
    ]

    const profileItems: any[] = [

    ]

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()
            if (session)
                setUser(session.user)
        }
        fetchUser()
    }, [])



    return (
        <>
            <nav id="global-bar" className="w-full flex flex-row justify-between items-center h-12 py-3 sticky top-0 z-10 text-foreground text-base font-mono bg-background">

                <div id="menu-part" className='pl-4 flex-grow-0 flex-shrink-0'>

                    <div className='flex flex-row items-center justify-start'>

                        <div id="burger" className='rounded-lg border p-2 cursor-pointer mr-2' onClick={() => setIsLeftMenuOpen(true)}>
                            <AiOutlineMenu size={14} />
                        </div>

                        <div id="logo" className='mr-2'>
                            <Image src={'/logo_500px.png'} alt="logo" width={32} height={32} />
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
                                src={user.user_metadata.picture}
                                alt={"profile picture"}
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


            <nav id="localbar" className="w-full border-b h-12 sticky top-12 z-10 bg-background p-0 text-foreground">

                <LocalNavBarComponent {...props} />

            </nav>

            <SideBar onLeft={true} isMenuOpen={isLeftMenuOpen} setIsMenuOpen={setIsLeftMenuOpen} menuItems={menuItems} image={{ link: '/logo_500px.png', alt: "logo" }} />

            <SideBar onLeft={false} isMenuOpen={isRightMenuOpen} setIsMenuOpen={setIsRightMenuOpen} menuItems={profileItems} image={{ link: user?.user_metadata.picture, alt: "profile picture" }} />
        </>
    )

}