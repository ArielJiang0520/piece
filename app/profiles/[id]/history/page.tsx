// /profiles/[id]/history
import { getSession } from "@/app/supabase-server";
import { getUserPromptHistory } from "@/app/supabase-server";
import MyHistory from "./components/MyHistory";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getSession()
    const isOwner = session !== null && session.user.id === params.id

    if (!isOwner) {
        return <>You don't have permission to view this page</>
    }

    const history = await getUserPromptHistory(params.id)

    return (
        <div className="w-full md:w-2/3  flex flex-col gap-4 px-5 py-5 lg:py-10 text-foreground font-mono">
            <MyHistory history={history} />
        </div>
    )
}
