// localhost:3000/create-a-world/templates
import WorldCard from "@/components/ui/display/World/WorldCard"
import LocalNavBar from "./local-navbar"
import { getAllWorldMetadata } from "@/app/supabase-server"
import Link from "next/link"


const genres = ['Fantasy', 'BL', 'Romance', 'First Person', 'Monster', 'Battle']
export default async function Page() {
    const worlds = await getAllWorldMetadata()
    return <>
        <LocalNavBar />
        <div className="w-full xl:w-4/5 2xl:w-2/3  flex flex-col gap-20 px-5 py-5 lg:py-5 text-foreground font-mono">
            <div className="w-full flex flex-col items-center space-y-6">
                <Link href={`/create-a-world`}>
                    <button className="primaryButton-pink rounded-full py-4 text-xl font-semibold px-6">
                        Create from Blank
                    </button>
                </Link>
                <div className="">
                    Or start from a template below
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-20">
                    {genres.map(genre => <div className="flex flex-col space-y-6 items-center justify-center">
                        <span className="text-3xl font-mono ">{genre}</span>
                        <div className="block bg-foreground/5 rounded-xl h-96 w-96">

                        </div>
                    </div>)}
                </div>
            </div>
        </div >
    </>
}
