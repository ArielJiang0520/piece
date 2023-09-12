import { getWorldDetailsById, getSession } from "@/app/supabase-server";
import WorldDisplay from "@/components/ui/display/World/WorldDisplay";
import LocalNavBar from "./local-navbar";
import Link from "next/link";
import { BackIcon } from "@/components/icon/icon";

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

            <div className="w-full md:w-2/3 flex flex-col gap-4 px-3 py-5 lg:py-10 text-foreground font-mono">
                <Link href={`/worlds`}>
                    <div className="flex flex-row justify-start items-center space-x-2 text-sm font-medium text-foreground/50 hover:text-foreground">
                        <BackIcon />
                        <div>
                            Back to all worlds
                        </div>
                    </div>
                </Link>
                <WorldDisplay world={world} isOwner={isOwner} />
            </div>
        </>

    )
}
