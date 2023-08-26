'use client'
import { AnimatePresence, motion } from "framer-motion"
import { CloseIcon } from "@/components/icon/icon";
import Image from 'next/image'
import Link from 'next/link'
import { LogoutButton } from "../button/button-helpers";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { usePathname } from 'next/navigation'
import { StarsIcon } from '@/components/icon/icon'
import { Tab } from '@headlessui/react'

const leftVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.3, type: 'tween' } },
    closed: { opacity: 0, x: "-100%", transition: { duration: 0.3, type: 'tween' } },
};


const rightVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.3, type: 'tween' } },
    closed: { opacity: 0, x: "100%", transition: { duration: 0.3, type: 'tween' } },
};


interface SideBarProps {
    onLeft: boolean,
    isMenuOpen: boolean,
    setIsMenuOpen: (isMenuOpen: boolean) => void,
    menuItems: { link: string; name: string }[] | any[],
    image: { link: string; alt: string };
}

export function SideBar({ onLeft, isMenuOpen, setIsMenuOpen, menuItems, image }: SideBarProps) {
    return <AnimatePresence>
        {isMenuOpen && (
            <div className={`fixed inset-0 flex ${onLeft ? "" : "justify-end"} z-50 text-foreground`}>
                <motion.div
                    className="fixed inset-0 bg-foreground opacity-50"
                    onClick={() => setIsMenuOpen(false)} />
                <motion.div
                    className={`relative w-80 h-full bg-background shadow-lg  ${onLeft ? "border-r rounded-tr-lg rounded-br-lg" : "border-l rounded-tl-lg rounded-bl-lg"}`}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={onLeft ? leftVariants : rightVariants}
                >
                    <CloseIcon
                        size={14}
                        className="text-foreground/50 absolute top-5 right-5 cursor-pointer"
                        onClick={() => setIsMenuOpen(false)} />
                    <div className='flex flex-col justify-start items-start px-4 py-8 font-mono font-medium h-full'>
                        <div id="logo" className='h-20'>
                            <Image className='rounded-full' src={image.link} alt={image.alt} width={48} height={48} />
                        </div>

                        <ul id="menu-items" className='space-y-2 flex-grow'>
                            {menuItems.map(item => <li key={item.name}>
                                <Link href={item.link} onClick={() => setIsMenuOpen(false)}>
                                    {item.name}
                                </Link>
                            </li>
                            )}
                        </ul>

                        {!onLeft && <LogoutButton />}
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
}


export const NavBarHeader = ({ title, subtitle, icon = <></> }: { title: string, subtitle: string | null | undefined, icon?: React.ReactNode }) => {
    return (
        <div className='flex flex-col font-mono text-foreground/50 justify-center pt-1 items-start'>
            <h1 className='font-bold text-xs '>
                {title.toLocaleUpperCase()}
            </h1>
            <div className="flex flex-row items-center justify-start space-x-2">
                <h2 className='font-semibold font-serif text-foreground text-base whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[200px] md:max-w-full '>
                    {subtitle || <Skeleton />}
                </h2>
                <div>
                    {icon}
                </div>
            </div>
        </div>
    )
}


interface NavBarSwitchTab {
    tabs: any[],
    onChange: (arg: any) => void;
}
export function NavBarSwitchTab({ tabs, onChange }: NavBarSwitchTab) {
    return (
        <Tab.Group onChange={(index) => { onChange(index) }}>
            <Tab.List className='h-full flex flex-row justify-start px-4 overflow-x-auto whitespace-nowrap mb-0 pb-0'>
                {tabs.map((tab, idx) => (
                    <Tab key={idx} className="outline-none mb-0 pb-0">
                        <div className={`capitalize  h-full font-mono text-sm text-foreground/80 flex px-5 items-center border-b-2 ui-selected:border-brand ui-selected:font-bold ui-not-selected:border-transparent`} >
                            {tab}
                        </div>
                    </Tab>
                ))}
            </Tab.List>
        </Tab.Group>
    )
}

interface NavBarSwitchLinkProps {
    tabs: {
        name: any;
        link: string;
    }[];
    pinned?: boolean
}
export function NavBarSwitchLink({ tabs, pinned = false }: NavBarSwitchLinkProps) {
    const currentPathname = usePathname();
    const mainTabs = pinned ? tabs.slice(0, tabs.length - 1) : tabs
    const pinnedTab = tabs[tabs.length - 1]
    return (
        <Tab.Group selectedIndex={tabs.findIndex(tab => tab.link === currentPathname)}>
            <div className="flex h-full overflow-hidden"> {/* <-- Parent container */}

                {/* Scrollable Tab List */}
                <div className="flex-grow overflow-x-auto whitespace-nowrap px-4">
                    <Tab.List className='h-full flex flex-row justify-start mb-0 pb-0'>
                        {mainTabs.map((tab, idx) => (
                            <Tab key={idx} className="outline-none mb-0 pb-0">
                                <Link href={tab.link}>
                                    <div className={`capitalize h-full font-mono text-sm text-foreground/80 flex px-5 items-center border-b-2 ui-selected:border-brand ui-selected:font-bold ui-not-selected:border-transparent`} >
                                        {tab.name}
                                    </div>
                                </Link>
                            </Tab>
                        ))}
                    </Tab.List>
                </div>

                {/* Pinned Tab */}
                {pinned && <div className="flex-none whitespace-nowrap px-4">
                    <Tab.List className='h-full flex flex-row justify-end mb-0 pb-0'>
                        <Tab key={tabs.length - 1} className="outline-none mb-0 pb-0">
                            <Link href={pinnedTab.link}>
                                <div className={`capitalize h-full font-mono text-sm text-white flex items-center border-b-2 ui-selected:border-brand ui-selected:font-bold ui-not-selected:border-transparent`} >
                                    <div className='flex flex-row items-center py-1 px-2 rounded-xl bg-brand'>
                                        <StarsIcon className='mr-1' />
                                        {pinnedTab.name}
                                    </div>
                                </div>
                            </Link>
                        </Tab>
                    </Tab.List>
                </div>}

            </div>
        </Tab.Group>
    )
}