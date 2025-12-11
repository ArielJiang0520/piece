import { getWorldMetadata } from "@/app/supabase-server";
import ExploreWorld from "./components/ExploreWorld";
import LocalNavBar from "../local-navbar";
import { MODELS } from "@/utils/helpers";

type ModelMap = {
    id: string;
};

export default async function Page({ params }: { params: { id: string } }) {
    const world = await getWorldMetadata(params.id)
    const keys = Object.keys(MODELS);

    const models: ModelMap[] = keys.map((key) => {
        return {
            id: key,
        };
    });

    return <>
        <LocalNavBar world={world} />
        <div className="w-full md:w-2/3 xl:w-1/2 flex flex-col gap-20 px-5 py-5 lg:py-5 text-foreground font-mono">
            <ExploreWorld world={world} models={models} />
        </div>
    </>
}
