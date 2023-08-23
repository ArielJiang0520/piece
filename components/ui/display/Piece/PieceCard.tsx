import { Piece, Profile } from "@/types/types";
import { FieldContentDisplay } from "@/components/ui/display/display-helpers";
import { TagsBarSmallDisplay } from "@/components/ui/input/tags-helpers";
import { IconButtonTiny } from "@/components/ui/button/button-helpers";
import { EmptyHeartIcon, CommentIcon, CrownIcon } from "@/components/icon/icon";
import SingleImage from "@/components/ui/image/SingleImage";
import Image from "next/image";
import { ImagesDisplayRow } from "../../image/ImagesDisplayRow";

interface PieceCardProps {
    author: Profile | null
    piece: Piece,
    displayAuthor: boolean,
    isOwner: boolean;
}
export default function PieceCard({ author, piece, displayAuthor, isOwner }: PieceCardProps) {
    const hasSingleImage = piece.images.length === 1
    return (
        <div className="flex flex-col">
            <div id="card" className="flex flex-col rounded-lg bg-foreground/5 w-full p-4 font-serif space-y-2">
                <div id="title">
                    <FieldContentDisplay content={piece.name} textSize="text-base" bold="font-bold" />
                </div>

                {piece.images.length >= 1 ?
                    !hasSingleImage ?
                        <div id="content" className={``}>
                            <ImagesDisplayRow bucket="world" dimension={{ width: "w-80", height: "h-80" }} paths={piece.images} />
                        </div> :
                        <div className="-mx-4">
                            <SingleImage bucket="world" path={piece.images[0]} dimension="w-auto h-auto" />
                        </div>
                    : null}

                <div id="content" className="">
                    <FieldContentDisplay content={piece.content.slice(0, 200)} textSize="text-xs" bold="font-normal" />
                </div>

                <div id="tags">
                    <TagsBarSmallDisplay tags={piece.tags} />
                </div>


                {/* <div id="stats" className="flex flex-row justify-between">
                    <div className="flex flex-row justify-end space-x-1">
                        <IconButtonSmall icon={<EmptyHeartIcon className="text-foreground/50" />} title={"1.2k"} />
                        <IconButtonSmall icon={<CommentIcon className="text-foreground/50" />} title={"12"} />
                    </div>
                </div> */}

                {displayAuthor &&
                    <div className="flex flex-row justify-between items-center" >
                        <div className="flex flex-row justify-start items-center space-x-1 text-foreground my-2 text-sm font-mono">

                            <Image
                                className='block rounded-full'
                                src={author?.avatar_url ? author.avatar_url : 'logo_500px.png'}
                                alt={"profile picture"}
                                width={20} height={20}
                                onClick={() => { }}
                            />

                            <div className="block w-24 md:w-auto overflow-hidden">{author?.full_name ? author.full_name : "Deleted User"}</div>
                            {/* <div>{isOwner ? <CrownIcon className="block text-brand" /> : null}</div> */}


                        </div>
                        <IconButtonTiny icon={<EmptyHeartIcon className="text-foreground/50" />} title={"1.2k"} />
                    </div>

                }


            </div>


        </div>
    )
}