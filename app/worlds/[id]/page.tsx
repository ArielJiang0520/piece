// localhost:3000/worlds/[id]
import { getSession } from "@/app/supabase-server";
import WorldDisplay from "@/components/ui/display/World/WorldDisplay";
import LocalNavBar from "./local-navbar";
import { getWorldMetadata } from "@/app/supabase-server";


export default async function Page({ params }: { params: { id: string } }) {
    const world = await getWorldMetadata(params.id)

    if (!world) {
        return <>Loading...</>
    }

    // const session = await getSession()
    // const isOwner = session !== null && session.user.id === world.creator_id;

    return (
        <>
            <LocalNavBar world={world} numPieces={world.pieces[0].count} />
            <div className="w-full md:w-2/3 flex flex-col gap-4 px-3 py-5 lg:py-10 text-foreground font-mono">
                <WorldDisplay world={world} />
            </div>
        </>
    )
}
