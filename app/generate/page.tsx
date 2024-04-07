import OpenAI from "openai";
import Generate from "./components/Generate"
import LocalNavBar from "./local-navbar"

const openai = new OpenAI();

export default async function Page({ }: {}) {

    const model_list = await openai.models.list()
    let models = []
    for await (const model of model_list) {
        models.push(model)
    }

    return (
        <>
            <LocalNavBar />
            <div className="w-full md:w-2/3 xl:w-1/2 flex flex-col gap-4 px-5 py-5 lg:py-10 text-foreground font-mono">
                <Generate models={models.filter(m => m.id.includes('gpt') && (!m.id.includes('vision'))).sort((a, b) => b.id.localeCompare(a.id))} />
            </div>
        </>
    )
}
