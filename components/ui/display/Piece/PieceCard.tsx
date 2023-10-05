import { GeneralJson, GenPieceJson, Piece, Folder, Profile, ChatHistoryJson } from "@/types/types";
import { FieldContentDisplay, FieldTitleDisplay } from "@/components/ui/display/display-helpers";
import { TagsBarTinyDisplay, TagsBarSmallDisplay, TagsBarDisplay } from "@/components/ui/input/tags-helpers";
import { IconButtonTiny, IconButtonSmall } from "@/components/ui/button/button-helpers";
import { EmptyHeartIcon, CommentIcon, CrownIcon, FolderIcon, SlashIcon, CalendarIcon, AIGenerateIcon, AtomIcon, RobotIcon, Rating18PlusIcon } from "@/components/icon/icon";
import SingleImage from "@/components/ui/image/SingleImage";
import Image from "next/image";
import { PieceDetails } from "@/app/supabase-server";
import { getDistanceToNow, getDistanceToNowAbbr } from "@/utils/helpers";
import { Markdown } from "@/components/ui/display/display-helpers";

interface PieceCardProps {
    piece: PieceDetails
    isOwner: boolean;
}

export default function PieceCard({ piece, isOwner }: PieceCardProps) {
    return (
        <div className="flex flex-col">
            <div id="card" className="flex flex-col rounded-lg bg-foreground/5 w-full p-4 font-serif space-y-2">

                <div id="profile" className="flex flex-row items-center justify-between font-mono text-sm space-x-1 text-foreground/80  my-1">
                    <div id="avatar" className="flex flex-row justify-start items-center space-x-1 text-foreground  text-sm font-mono font-medium">

                        <Image
                            className='block rounded-full'
                            src={piece.profiles?.avatar_url ? piece.profiles?.avatar_url : 'logo_500px.png'}
                            alt={"profile picture"}
                            width={20} height={20}
                            onClick={() => { }}
                        />
                        <div className="w-auto overflow-hidden">{piece.profiles?.full_name ? piece.profiles?.full_name : "Deleted User"}</div>
                        <div>{isOwner ? <CrownIcon className="block text-brand" /> : null}</div>
                        <span className="font-mono text-xs text-foreground/50 mr-1">{getDistanceToNowAbbr(piece.created_at)}</span>
                    </div>
                    <div className="flex flex-row items-center">
                        {piece.nsfw && <Rating18PlusIcon className="text-brand" />}
                        {piece.piece_type !== "original" && <RobotIcon className="text-brand" />}
                    </div>
                </div>

                <div id="title" className="flex flex-row items-start justify-between">
                    <FieldContentDisplay content={piece.name} textSize="text-base" bold="font-bold" />
                </div>

                {piece.piece_type === "original" && (piece.piece_json as GeneralJson).images.length > 0 ?
                    <div className="-mx-4">
                        <SingleImage
                            bucket="world"
                            path={(piece.piece_json as GeneralJson).images[0]}
                            dimension="w-auto h-auto"
                            numberIcon={(piece.piece_json as GeneralJson).images.length > 1 ? (piece.piece_json as GeneralJson).images.length : null}
                        />
                    </div>
                    : null
                }

                {piece.piece_type === "gen-piece" && <div className="flex flex-col items-start justify-center space-y-2">
                    <div className='border-t border-b px-2 py-2 font-mono text-sm text-foreground bg-foreground/5 w-full'>
                        <Markdown>{(piece.piece_json as GenPieceJson).output.slice(0, 200)}</Markdown>
                    </div>
                </div>}

                {piece.piece_type === "roleplay" && <div className="flex flex-col items-start justify-center space-y-2">
                    <div className='flex flex-col font-mono text-sm  space-y-2'>
                        {(piece.piece_json as ChatHistoryJson).output.slice(0, 2).map((msg: { role: string, content: string }, index: number) =>
                            <div key={index} className='w-full flex flex-col space-y-2'>
                                <div className=' capitalize '>{msg.role} {index % 2 == 0 ? "(User)" : "(AI)"}</div>
                                <div className={`border-t border-b px-4 py-2   ${index % 2 == 0 ? 'bg-foreground/10' : 'bg-foreground/5'}`}>{msg.content.slice(0, 100)}</div>
                            </div>
                        )}
                    </div>
                </div>}

                {piece.piece_type === "original" && (piece.piece_json as GeneralJson).images.length == 0 && <div id="content" className="">
                    <FieldContentDisplay content={(piece.piece_json as GeneralJson).content.slice(0, 200)} textSize="text-xs" bold="font-normal" />
                </div>}

                {piece.tags.length > 0 && <div id="tags">
                    <TagsBarDisplay tags={piece.tags} scroll={true} />
                </div>}


                <div className="flex flex-row justify-between items-center text-foreground/50" >

                    {piece.folders ? <div className="flex flex-row items-center space-x-1 ">
                        <FolderIcon />
                        <span className="font-mono text-sm font-medium ">{piece.folders.name}</span>

                    </div> : <div className="block"></div>}

                    <div className="flex flex-row items-center font-mono text-sm space-x-2 justify-end">
                        {/* <CalendarIcon /> */}

                        <IconButtonTiny icon={<EmptyHeartIcon className="text-foreground/50" />} title={"0"} />

                    </div>
                </div>




            </div>
        </div>
    )
}