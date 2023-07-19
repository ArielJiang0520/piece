import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '@/components/ui/button/LogoutButton'

export default async function NavBar() {
    // const supabase = createServerComponentClient({ cookies })

    // const {
    //     data: { user },
    // } = await supabase.auth.getUser()

    const user = null

    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 py-3 sticky top-0 bg-background z-50">
            <div className='w-full max-w-4xl flex justify-start items-center p-3 text-sm text-foreground'>
                <Link
                    href="/"
                    className="py-2 px-4"
                >
                    Home
                </Link>
                <Link
                    href="/"
                    className="py-2 px-4"
                >
                    Browse
                </Link>
                <Link
                    href="/create-a-world"
                    className="py-2 px-4"
                >
                    Create
                </Link>
            </div>

            <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm text-foreground">
                <div />
                <div>
                    {user ? (
                        <div className="flex items-center gap-4">
                            Hey!
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
            </div>
        </nav>)

}