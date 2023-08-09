import WorldCard from "@/components/ui/display/World/WorldCard"
import { getSession, getWorldsByUser } from "@/app/supabase-server";

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getSession()
    const worlds = await getWorldsByUser(params.id)
    if (!worlds)
        return <>Loading...</>
    return (
        <div className="w-full md:w-1/2 flex flex-col gap-14 px-2 py-5 lg:py-10 text-foreground font-mono">
            <div className="flex flex-col space-y-6">
                {worlds
                    .sort((a, b) => {
                        const dateA = a.modified_at || a.created_at;
                        const dateB = b.modified_at || b.created_at;
                        // For descending order (latest to oldest)
                        return dateB.localeCompare(dateA);
                    })
                    .map((world, idx) => <WorldCard key={idx} world={world} isOwner={session !== null && session.user.id === params.id} />)}
            </div>
        </div>
    )
}