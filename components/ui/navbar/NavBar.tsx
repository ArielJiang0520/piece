'use client'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import LogoutButton from '@/components/ui/button/LogoutButton'
import { useEffect, useState } from 'react'
import { User } from '@supabase/auth-helpers-nextjs'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { AnimatePresence, motion } from "framer-motion";
import type { Database } from '@/types/supabase'


export default function NavBar() {
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
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
        }
        fetchUser()
    }, [])

    const variants = {
        open: { opacity: 1, x: 0, transition: { duration: 0.3, type: 'tween' } },
        closed: { opacity: 0, x: "-100%", transition: { duration: 0.3, type: 'tween' } },
    };

    return (
        <nav id="global-bar" className="w-full flex flex-row justify-between items-center border-b h-16 py-3 sticky top-0 text-foreground text-base font-mono bg-background z-50">
            <div id="menu-part">
                <AiOutlineMenu size={24} onClick={() => setIsMenuOpen(true)} />
                <AnimatePresence>
                    {isMenuOpen && (
                        <div className="fixed inset-0 flex z-50">
                            <motion.div
                                className="fixed inset-0 bg-black opacity-50"
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <motion.div
                                className="relative w-80 h-full bg-white shadow-lg"
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={variants}
                            >
                                <AiOutlineClose
                                    size={24}
                                    className="absolute top-3 right-3 cursor-pointer"
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                {/* Add your menu content here */}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div id="signin-part">
                {user ? (
                    <div className="flex items-center gap-4">
                        {`Hey! ${user.user_metadata["name"]}!`}
                        <LogoutButton />
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
    )

}