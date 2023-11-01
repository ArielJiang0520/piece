// worlds/[id]/prompts

import LocalNavBar from "../local-navbar";
import { getSession, getWorldDetails, getPromptMetadata, getPiecesByPage, getWorldMetadata } from "@/app/supabase-server";
import { PromptWorldPieces } from "./components/PromptWorldPieces";

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string },
    searchParams?: { [key: string]: string | undefined };
}) {
    const WorldMetadata = await getWorldMetadata(params.id)
    const prompts = await getPromptMetadata(WorldMetadata.id);

    return (
        <>
            <LocalNavBar world={WorldMetadata} />
            <div className="w-full md:w-2/3 max-w-3xl flex flex-col gap-14 px-1 py-5 lg:py-10 text-foreground font-mono">
                <PromptWorldPieces world={WorldMetadata} prompts={prompts} />
            </div>
        </>
    )
}
