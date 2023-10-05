// localhost:3000/worlds
import LocalNavBar from "./local-navbar"
import AllWorlds from "./components/AllWorlds";
import { getAllWorldMetadata, WorldMetadata } from "../supabase-server";

export default async function Page() {
    const worlds = await getAllWorldMetadata()
    return <>
        <LocalNavBar />
        <div className="w-full md:w-2/3 flex flex-col gap-14 px-2 py-5 lg:py-10 text-foreground font-mono">
            <AllWorlds worlds={worlds.sort((a: WorldMetadata, b: WorldMetadata) => {
                const dateA = a.modified_at || a.created_at;
                const dateB = b.modified_at || b.created_at;
                // For descending order (latest to oldest)
                return dateB.localeCompare(dateA);
            })} />
        </div>
    </>
}