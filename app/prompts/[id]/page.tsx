import { getPromptDetails, getWorldMetadata } from "@/app/supabase-server"
import LocalNavBar from "./local-navbar"
import { PromptDisplay } from "@/components/ui/display/Piece/PromptDisplay"
export default async function Page({
    params,
}: {
    params: { id: string },
}) {

    const prompt = await getPromptDetails(params.id);
    const world = await getWorldMetadata(prompt.world_id);
    return (
        <>
            <LocalNavBar prompt={prompt} />
            <div className="w-full md:w-2/3  flex flex-col gap-4 px-5 py-5 lg:py-10 text-foreground font-mono">
                <PromptDisplay prompt={prompt} world={world} />
            </div>
        </>
    )
}
