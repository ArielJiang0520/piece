import { AnimatePresence, motion } from "framer-motion"
import { CloseIcon } from "@/components/icon/icon";
import Image from 'next/image'
import Link from 'next/link'
import LogoutButton from "../button/LogoutButton";

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
                    <div className='flex flex-col justify-start items-start px-4 py-8 font-mono font-bold'>
                        <div id="logo" className='h-20'>
                            <Image className='rounded-full' src={image.link} alt={image.alt} width={48} height={48} />
                        </div>
                        <ul id="menu-items" className='space-y-2'>
                            {menuItems.map(item => <li key={item.name}>
                                <Link href={item.link} onClick={() => setIsMenuOpen(false)}>
                                    {item.name}
                                </Link>
                            </li>
                            )}
                        </ul>
                        <LogoutButton />
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
}


export const NavBarHeader = ({ title, subtitle }: { title: string, subtitle: string }) => {
    return (
        <div className='flex flex-col font-mono text-foreground/50 justify-center pt-1 items-start'>
            <h1 className='font-bold text-xs '>
                {title.toLocaleUpperCase()}
            </h1>
            <h2 className='font-semibold font-serif text-foreground text-base'>
                {subtitle}
            </h2>
        </div>
    )
}
