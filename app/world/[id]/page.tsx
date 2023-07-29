import { getWorldDetailsById } from "@/app/supabase-server";
import WorldDisplay from "@/components/ui/display/WorldDisplay";

export default async function Page({ params }: { params: { id: string } }) {
    const world = await getWorldDetailsById(params.id)

    if (!world)
        return <>Loading...</>

    return (
        <div className="w-full md:w-2/3 flex flex-col gap-14 px-5 py-5 lg:py-10 text-foreground font-mono">
            <WorldDisplay world={world} />
        </div>
    )
}
