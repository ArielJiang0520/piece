// /profiles/[id]/worlds
import MyWorlds from "./components/MyWorlds";
import { getWorldsByUser, getSession } from "@/app/supabase-server";

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getSession()
    const isOwner = session !== null && session.user.id === params.id
    const worlds = await getWorldsByUser(params.id, isOwner)

    return (
        <div className="w-full md:w-2/3 flex flex-col gap-7 px-2 py-5 lg:py-10 text-foreground font-mono">
            <MyWorlds worlds={worlds} isOwner={isOwner} />
        </div>
    )
}