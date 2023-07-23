'use client'
import Link from 'next/link'
import LogoutButton from '@/components/ui/button/LogoutButton'
import { ComponentType, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/auth-helpers-nextjs'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { AnimatePresence, motion } from "framer-motion"
import Image from 'next/image'

interface NavBarProps {
    PageTitleNavBarComponent: ComponentType<any>;
    LocalNavBarComponent: ComponentType<any>;
    [key: string]: any;
}

export default function NavBar({ PageTitleNavBarComponent, LocalNavBarComponent, ...props }: NavBarProps) {
    const supabase = createClientComponentClient()
    const [user, setUser] = useState<User | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [menuItems, setMenuItems] = useState([
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
    ])

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

    const variants = {
        open: { opacity: 1, x: 0, transition: { duration: 0.3, type: 'tween' } },
        closed: { opacity: 0, x: "-100%", transition: { duration: 0.3, type: 'tween' } },
    };

    return (
        <>
            <nav id="global-bar" className="w-full flex flex-row justify-between items-center h-12 py-3 sticky top-0 z-10 text-foreground text-base font-mono bg-background">
                <div id="menu-part" className='mx-4 flex-grow-0 flex-shrink-0'>
                    <div className='flex flex-row items-center justify-start space-x-3'>
                        <div id="burger" className='rounded-lg border p-2 cursor-pointer' onClick={() => setIsMenuOpen(true)}>
                            <AiOutlineMenu size={14} />
                        </div>
                        <div>
                            <Image src={'/logo_500px.png'} alt="logo" width={32} height={32} />
                        </div>
                    </div>
                </div>
                <div className='overflow-hidden whitespace-nowrap overflow-ellipsis flex-grow flex-shrink'>
                    <PageTitleNavBarComponent {...props} />
                </div>
                <div id="signin-part" className='mx-4 flex-grow-0 flex-shrink-0'>
                    {user ? (
                        <div className="flex items-center">
                            <Image className='rounded-full' src={user.user_metadata.picture} alt={"profile picture"} width={32} height={32} />
                            {/* <LogoutButton /> */}
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


            <nav className="w-full flex flex-row justify-between items-center border-b
                h-12 py-3 sticky top-12 z-10 text-foreground text-base font-mono bg-background">
                <div id="menu-part" className='mx-4'>
                    <LocalNavBarComponent {...props} />
                </div>
                <div id="other-part" className='mx-4'>

                </div>
            </nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 flex z-50" >
                        <motion.div
                            className="fixed inset-0 bg-foreground opacity-50"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            className="relative w-80 h-full bg-background shadow-lg border-r rounded-tr-lg rounded-br-lg"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={variants}
                        >
                            <AiOutlineClose
                                size={14}
                                className="text-foreground/50 absolute top-5 right-5 cursor-pointer"
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <div className='flex flex-col justify-start items-start px-4 py-8 font-mono font-bold'>
                                <div id="logo" className='h-20'>
                                    <Image src={'/logo_500px.png'} alt="logo" width={48} height={48} />
                                </div>
                                <ul id="menu-items" className='space-y-2'>
                                    {menuItems.map(item =>
                                        <li key={item.name}>
                                            <Link href={item.link} onClick={() => setIsMenuOpen(false)}>
                                                {item.name}
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )

}
