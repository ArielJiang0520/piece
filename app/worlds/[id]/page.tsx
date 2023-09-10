import { getWorldDetailsById, getSession } from "@/app/supabase-server";
import WorldDisplay from "@/components/ui/display/World/WorldDisplay";
import LocalNavBar from "./local-navbar";


export default async function Page({ params }: { params: { id: string } }) {
    const world = await getWorldDetailsById(params.id)

    if (!world) {
        return <>Loading...</>
    }

    const session = await getSession()
    const isOwner = session !== null && session.user.id === world.creator_id

    return (
        <>
            <LocalNavBar world={world} />
            <div className="w-full md:w-2/3 flex flex-col gap-14 px-5 py-5 lg:py-10 text-foreground font-mono">
                <WorldDisplay world={world} isOwner={isOwner} />
            </div>
        </>

    )
}
