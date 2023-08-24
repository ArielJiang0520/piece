import { getAllWorlds } from "../supabase-server"
import AllWorlds from "./components/AllWorlds"
import LocalNavBar from "./local-navbar"

export default async function Page() {
    const worlds = await getAllWorlds()

    return <>
        <LocalNavBar />
        <div className="w-full md:w-2/3 flex flex-col gap-14 px-5 py-5 lg:py-10 text-foreground font-mono">
            <AllWorlds worlds={worlds} />
        </div>
    </>
}