
import { getModifierDetails } from "../supabase-server"
import Modifiers from "./components/Modifiers"
import LocalNavBar from "./local-navbar"

export default async function Page({ }: {}) {

    const modifiers = await getModifierDetails()

    return (
        <>
            <LocalNavBar />
            <div className="w-full md:w-2/3 xl:w-1/2 flex flex-col gap-4 px-5 py-5 lg:py-10 text-foreground font-mono">
                <Modifiers modifiers={modifiers} />
            </div>
        </>
    )
}
