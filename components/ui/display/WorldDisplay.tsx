import type { World } from "@/types/types.world"
import { IconButton } from "@/components/ui/button/IconButton";
import { StarIcon, AtomIcon } from "@/components/icon/icon"
import { FieldContentDisplay, MetadataDisplay } from "@/components/ui/display/display-helpers";
import { TagsBarDisplay } from "@/components/ui/display/tags-display-helpers";
import { AccordionDisplay } from './AccordionDisplay';
import { WorldDescriptionSection } from "@/types/types.world";
import { LazyImage } from "./LazyImage";
import Link from "next/link";

interface WorldDisplayProps {
    world: World;
    preview?: boolean
}

export default function WorldDisplay({ world, preview = false }: WorldDisplayProps) {
    return (
        <div className='flex flex-col space-y-3 items-start'>

            {!preview && <div id="button-group" className='w-full flex flex-row justify-start space-x-2'>
                <div className="cursor-pointer">
                    <IconButton icon={<StarIcon />} title={"124"} />
                </div>
                <div className="cursor-pointer">
                    <Link href={{ pathname: '/create-a-piece', query: { id: world.id } }} >
                        <IconButton icon={<AtomIcon />} title={"Create a Piece"} />
                    </Link>
                </div>
            </div>}

            <div id="title-group" className='w-full flex flex-col'>
                <FieldContentDisplay content={world.world_name} textSize="text-4xl" bold="font-semibold" />
            </div>

            <div id='image-display' className="flex flex-row space-x-2 overflow-x-auto">
                {world.images.map((path, index) =>
                    <div key={index} className="h-80 flex-shrink-0 relative">
                        <LazyImage bucket="world" path={path} dimension="h-80 w-80" />
                    </div>
                )}
            </div>

            <div id="metadata-group" className="w-full flex flex-col" >
                <MetadataDisplay items={[world.created_at, world.origin, world.nsfw, "metadata"]} />
            </div>
            <div id="logline-group" className='w-full flex flex-col'>
                <FieldContentDisplay content={world.logline} textSize="text-base" bold="font-normal" />
            </div>
            <div id="tags-group" className='w-full flex flex-col'>
                <TagsBarDisplay tags={world.tags} preview={preview} />
            </div>
            <div id="description-group" className='w-full flex flex-col'>
                <AccordionDisplay sections={world.description as WorldDescriptionSection[]} />
            </div>
            <div id="authors-group" className='w-full flex flex-col'>

            </div>

        </div>
    )
}


// interface WorldDisplayPreviewProps {
//     world: World;
// }

// export function WorldDisplayPreview({ world }: WorldDisplayProps) {
//     return (
//         <div className='flex flex-col space-y-3 items-start'>
//             <div id="title-group" className='w-full flex flex-col'>
//                 <FieldContentDisplay content={world.world_name} textSize="text-4xl" bold="font-semibold" />
//             </div>
//             <div id="metadata-group" className="w-full flex flex-col" >
//                 <MetadataDisplay items={["metadata", "metadata", "metadata", "metadata"]} />
//             </div>
//             <div id="logline-group" className='w-full flex flex-col'>
//                 <FieldContentDisplay content={world.logline} textSize="text-base" bold="font-normal" />
//             </div>
//             <div id="tags-group" className='w-full flex flex-col'>
//                 <TagsBarDisplay tags={world.tags} />
//             </div>
//             <div id="description-group" className='w-full flex flex-col'>
//                 <AccordionDisplay sections={world.description as WorldDescriptionSection[]} />
//             </div>
//             <div id="authors-group" className='w-full flex flex-col'>

//             </div>

//         </div>
//     )
// }