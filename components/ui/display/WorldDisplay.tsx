import type { World } from "@/types/types.world"
import { IconButton } from "@/components/ui/button/IconButton";
import { AiOutlineStar } from 'react-icons/ai'
import { GiAtom } from 'react-icons/gi'
import { FieldTitleDisplay, FieldContentDisplay, MetadataDisplay } from "@/components/ui/display/display-helpers";
import { TagsBarDisplay } from "@/components/ui/display/tags-display-helpers";
import { AccordionDisplay } from "@/components/ui/display/display-helpers";
import { WorldDescriptionSection } from "@/types/types.world";

interface WorldDisplayProps {
    world: World;
}

export default function WorldDisplay({ world }: WorldDisplayProps) {
    return (
        <div className='flex flex-col space-y-3 items-start'>
            <div id="button-group" className='w-full flex flex-row justify-start space-x-2'>
                <div className="cursor-pointer">
                    <IconButton icon={<AiOutlineStar />} title={"124"} />
                </div>
                <div className="cursor-pointer">
                    <IconButton icon={<GiAtom />} title={"Create a Piece"} />
                </div>
            </div>
            <div id="title-group" className='w-full flex flex-col'>
                <FieldContentDisplay content={world.world_name} textSize="text-4xl" bold="font-semibold" />
            </div>
            <div id="metadata-group" className="w-full flex flex-col" >
                <MetadataDisplay items={["metadata", "metadata", "metadata", "metadata"]} />
            </div>
            <div id="logline-group" className='w-full flex flex-col'>
                <FieldContentDisplay content={world.logline} textSize="text-base" bold="font-normal" />
            </div>
            <div id="tags-group" className='w-full flex flex-col'>
                <TagsBarDisplay tags={world.tags} />
            </div>
            <div id="description-group" className='w-full flex flex-col'>
                <AccordionDisplay sections={world.description as WorldDescriptionSection[]} />
            </div>
            <div id="authors-group" className='w-full flex flex-col'>

            </div>

        </div>
    )
}