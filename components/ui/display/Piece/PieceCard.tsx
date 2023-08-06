import { Piece } from "@/types/types.world";
import { FieldContentDisplay } from "@/components/ui/display/display-helpers";
import { TagsBarSmallDisplay } from "@/components/ui/display/tags-display-helpers";
import { IconButtonSmall } from "@/components/ui/button/IconButton";
import { HeartIcon, CommentIcon } from "@/components/icon/icon";
import SingleImage from "@/components/ui/image/SingleImage";

interface PieceCardProps {
    piece: Piece
}
export default function PieceCard({ piece }: PieceCardProps) {
    return (
        <div id="card" className="flex flex-col rounded-lg bg-foreground/5 w-full p-4 font-serif">
            <div id="title">
                <FieldContentDisplay content={piece.title} textSize="text-base" bold="font-bold" />
            </div>
            {piece.images.length >= 1 ?
                <div id="content" className="my-2 -mx-4">
                    <SingleImage bucket="world" path={`${piece.images[0]}`} dimension="w-24 h-24" />
                </div> :
                <div id="logline" className="my-2">
                    <FieldContentDisplay content={piece.logline} textSize="text-xs" bold="font-normal" />
                </div>
            }
            <div id="tags">
                <TagsBarSmallDisplay tags={piece.tags} />
            </div>
            <div id="stats" className="flex flex-row justify-between">
                <div className="flex flex-row justify-start space-x-1">
                    <IconButtonSmall icon={<HeartIcon className="text-foreground/50" />} title={"1.2k"} />
                    <IconButtonSmall icon={<CommentIcon className="text-foreground/50" />} title={"12"} />
                </div>
            </div>
        </div>
    )
}