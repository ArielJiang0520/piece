// worlds/[id]/pieces?page=n
import { WorldPieces } from "./components/WorldPieces";
import LocalNavBar from "../local-navbar";
import { getSession, getWorldDetails, getPiecesByPage, getPromptMetadata } from "@/app/supabase-server";

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string },
    searchParams?: { [key: string]: string | undefined };
}) {
    const worldDetails = await getWorldDetails(params.id)
    const { profiles, folders, ...world } = worldDetails

    const session = await getSession();
    const isOwner = session !== null && profiles !== null && session.user.id === profiles.id

    const offset = 1000
    let page = 1
    if (searchParams && searchParams.page) {
        page = parseInt(searchParams.page)
    }
    const pieces = await getPiecesByPage(params.id, page - 1, offset)

    return (
        <>
            <LocalNavBar world={world} />
            <div className="w-full xl:w-4/5 2xl:w-2/3 flex flex-col gap-14 px-1 py-5 lg:py-10 text-foreground font-mono">
                <WorldPieces world={world} pieces={pieces} folders={folders} isOwner={isOwner} />
            </div>
        </>
    )
}
