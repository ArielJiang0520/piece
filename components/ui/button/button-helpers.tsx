'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
    const router = useRouter()

    // Create a Supabase client configured to use cookies
    const supabase = createClientComponentClient()

    const signOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <button
            className="text-sm py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
            onClick={signOut}
        >
            Logout
        </button>
    )
}


interface IconButtonProps {
    icon: JSX.Element,
    title?: string | null
}
export function IconButtonMid({ icon, title = null }: IconButtonProps) {
    return <div className={`cursor-pointer bg-none h-8 md:h-10 flex flex-row items-center justify-center space-x-1 rounded-lg border py-1 px-2 min-w-[35px] whitespace-nowrap`}>
        <div>
            {icon}
        </div>
        {title && <div className="font-mono text-foreground">
            {title}
        </div>}
    </div>
}

export function IconButtonSmall({ icon, title }: IconButtonProps) {
    return <div className="cursor-pointer bg-none text-foreground/80 h-5 flex flex-row items-center justify-center space-x-1 rounded-lg border py-1 px-2 whitespace-nowrap">
        <div className='text-foreground/50'>
            {icon}
        </div>
        <div className="text-xs font-mono">
            {title}
        </div>
    </div>
}

// for likes, saves, etc
export function IconButtonTiny({ icon, title }: IconButtonProps) {
    return <div className="cursor-pointer h-8 flex flex-row items-center justify-center space-x-1 whitespace-nowrap">
        <div>
            {icon}
        </div>
        <div className="text-xs font-mono text-foreground">
            {title}
        </div>
    </div>
}

export function CopyableID({ id_string, id }: { id_string: string, id: string }) {
    const [showWidget, setShowWidget] = useState(false);

    const handleButtonClick = () => {
        const contentToCopy = "Text to be copied"; // Replace with your content

        navigator.clipboard.writeText(contentToCopy)
            .then(() => {
                setShowWidget(true);

                // Hide widget after a delay (e.g., 2 seconds)
                setTimeout(() => {
                    setShowWidget(false);
                }, 1000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };


    return (<div className="relative flex flex-row font-mono text-xs space-x-1 items-center justify-start">
        <div className="font-semibold text-foreground/80">{id_string}:</div>
        <button className="cursor-pointer rounded-2xl bg-brand text-white py-1 px-2" onClick={handleButtonClick}>
            {id}
        </button>
        {showWidget && <div className="absolute left-full ml-2 py-1 px-2 bg-foreground/5 rounded-2xl">Copied!</div>}
    </div>)
}