import { getWorldDetailsById, WorldsResponse } from "@/app/supabase-server";
import { FieldTitleDisplay, FieldContentDisplay } from "@/components/ui/display/displays";
import { TagsBarDisplay } from "@/components/ui/button/TagsBar";
import { AccordionDisplay } from "@/components/ui/display/displays";
import { WorldDescriptionSection } from "@/types/types.world";

export default async function WorldDisplay({ params }: { params: { id: string } }) {
    const worldDetails = await getWorldDetailsById(params.id)

    if (!worldDetails)
        return (<>Loading...</>)
    if (worldDetails.length !== 1)
        return (<>Error!</>)

    const world = worldDetails[0]

    return (
        <>
            <div className="w-full md:w-2/3 flex flex-col gap-14 px-5 py-16 lg:py-24 text-foreground font-mono">
                <div className='flex flex-col space-y-6 items-start'>
                    <div id="creator-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"creator"} />
                        <FieldContentDisplay content={world.creator_id as string} textSize="text-base" bold="font-semibold" />
                    </div>

                    <div id="title-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"title"} />
                        <FieldContentDisplay content={world.world_name} textSize="text-4xl" bold="font-semibold" />
                    </div>

                    <div id="logline-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"logline"} />
                        <FieldContentDisplay content={world.logline} textSize="text-base" bold="font-normal" />
                    </div>

                    <div id="tags-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"tags"} />
                        <TagsBarDisplay tags={world.tags} />
                    </div>

                    <div id="description-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"description"} />
                        <AccordionDisplay sections={world.description as WorldDescriptionSection[]} />
                    </div>

                    <div id="asset-group" className='w-full flex flex-col'>

                    </div>

                </div>
            </div>
        </>
    )

}
