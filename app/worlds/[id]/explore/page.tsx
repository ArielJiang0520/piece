import { getWorldMetadata } from "@/app/supabase-server";
import ExploreWorld from "./components/ExploreWorld";
import LocalNavBar from "../local-navbar";
import OpenAI from "openai";

const openai = new OpenAI();

export default async function Page({ params }: { params: { id: string } }) {
    const world = await getWorldMetadata(params.id)
    const models = [{ "id": "deepseek-r1" }, { "id": "gpt-4" },]
    // const model_list = await openai.models.list()
    // let models = []
    // for await (const model of model_list) {
    //     models.push(model)
    // }
    // models = models.filter(m => m.id.includes('gpt') && (!m.id.includes('vision'))).sort((a, b) => b.id.localeCompare(a.id))

    // if (!world) {
    //     return <></>
    // }

    return <>
        <LocalNavBar world={world} />
        <div className="w-full md:w-2/3 xl:w-1/2 flex flex-col gap-20 px-5 py-5 lg:py-5 text-foreground font-mono">
            <ExploreWorld world={world} models={models} />
        </div>
    </>
}
