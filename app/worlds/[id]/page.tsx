// localhost:3000/worlds/[id]
import WorldDisplay from "@/components/ui/display/World/WorldDisplay";
import LocalNavBar from "./local-navbar";
import { getWorldMetadata } from "@/app/supabase-server";

export default async function Page({ params }: { params: { id: string } }) {
    const world = await getWorldMetadata(params.id)

    if (!world) {
        return <>Loading...</>
    }

    return (
        <>
            <LocalNavBar world={world} />
            <div className="w-full xl:w-4/5 2xl:w-2/3 flex flex-col gap-4 px-3 py-5 lg:py-10 text-foreground font-mono">
                <WorldDisplay world={world} />
            </div>
        </>
    )
}
