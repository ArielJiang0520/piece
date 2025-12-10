import { getWorldMetadata } from "@/app/supabase-server";
import ExploreWorld from "./components/ExploreWorld";
import LocalNavBar from "../local-navbar";

export default async function Page({ params }: { params: { id: string } }) {
    const world = await getWorldMetadata(params.id)
    const models = [{ "id": "deepseek-v3.2" }, { "id": "deepseek-v3.1-terminus" }, { "id": "deepseek-v3.1" }, { "id": "deepseek-v3" }, { "id": "gpt-4" },]

    return <>
        <LocalNavBar world={world} />
        <div className="w-full md:w-2/3 xl:w-1/2 flex flex-col gap-20 px-5 py-5 lg:py-5 text-foreground font-mono">
            <ExploreWorld world={world} models={models} />
        </div>
    </>
}
