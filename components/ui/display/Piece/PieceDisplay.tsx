'use client'
import type { ChatHistoryJson, TypedPiece, GenPieceJson, GeneralJson, Piece, Profile, World, Folder, Comment, Like } from "@/types/types"
import { EmptyHeartIcon, WorldIcon, CheckIcon, CalendarIcon, BookIcon, RobotIcon, TrashIcon, StarIcon, SingleUserIcon, CrownIcon, StarsIcon, ArrowUpRight } from "@/components/icon/icon"
import { FieldContentDisplay, FieldTitleDisplay, Markdown } from "@/components/ui/display/display-helpers";
import { TagsBarDisplay } from "@/components/ui/input/tags-helpers";
import Link from "next/link";
import { AuthorDisplay } from "@/components/ui/display/user-display-helpers";
import PieceImages from "@/components/ui/image/PieceImages";
import { formatTimestamp, getDistanceToNow } from "@/utils/helpers";
import { ChatHistoryDisplay, GenPieceDisplay } from "./piece-display-helpers";
import { BackIcon, FolderIcon, PencilIcon, SlashIcon } from "@/components/icon/icon";
import { IconButtonMid, IconButtonTiny } from "@/components/ui/button/button-helpers";
import { useEffect, useState } from "react";
import PopupDialog from "@/components/ui/input/PopupDialog";
import { delete_piece, update_special_piece } from "@/utils/piece-helpers";
import { DropDownMenu, DropDownMenuOptions } from "@/components/ui/menu/InPlaceDropdown";
import { fetch_all_folders, update_piece_folder } from "@/utils/folder-helpers";
import { useRouter } from "next/navigation";
import { notify_error, notify_success } from "../../widget/toast";
import { CopyableID } from "@/components/ui/button/button-helpers";
import { useSupabase } from "@/app/supabase-provider";
import { LikeButton } from "../../button/LikeButton";


interface PieceDisplayProps {
    piece: Piece;
    world: World;
    folder: Folder | null;
    author: Profile;
    likes: Like[];
    comments: Comment[];
    preview?: boolean
}
export default function PieceDisplay({ piece, world, folder, author, likes, comments, preview = false }: PieceDisplayProps) {
    const { user } = useSupabase();
    const isOwner = user && user.id ? user.id === piece.creator_id : false
    const isWorldOwner = user && user.id ? user.id === world.creator_id : false
    const router = useRouter();

    const [isMoveFolder, setIsMoveFolder] = useState(false)
    const [isEditingPiece, setIsEditingPiece] = useState(false)
    const [isDeletePiece, setIsDeletePiece] = useState(false)

    const [folders, setFolders] = useState<Array<DropDownMenuOptions>>([]);

    const fetchFolders = async () => {
        const fetchedFolders = await fetch_all_folders(world.id);
        setFolders(fetchedFolders.map(folder => {
            return {
                name: folder.name,
                icon: folder.id === piece.folder_id ? CheckIcon : FolderIcon,
                function: () => {
                    update_piece_folder(piece.id, folder.id);
                    router.refresh();
                    notify_success(`Folder successfully moved to "${folder.name}"!`)
                }
            } as DropDownMenuOptions
        }))
    }

    const onDelPiece = async () => {
        try {
            await delete_piece(piece.id)
            router.push(`/worlds/${world.id}/pieces`)
            notify_success(`${piece.id} successfully deleted!`)
        } catch (error) {
            notify_error(`Error while deleting ${piece.id}: ${JSON.stringify(error)}`)
        }
    }

    useEffect(() => {
        if (isMoveFolder && folders.length === 0) {
            fetchFolders();
        }
    }, [isMoveFolder])

    useEffect(() => {
        fetchFolders();
    }, [piece, folder])

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between space-y-3">

                <Link id="back-button" href={`/worlds/${world.id}/pieces`}>
                    <div className="flex flex-row justify-start items-center space-x-2 text-sm font-medium text-foreground/50 hover:text-foreground">
                        <BackIcon />
                        <div>
                            All pieces in this world
                        </div>
                    </div>
                </Link>

                <div id="button-group" className="flex flex-row items-center space-x-1">
                    {isOwner && <div onClick={() => setIsDeletePiece(true)}>
                        <IconButtonMid icon={<TrashIcon />} title={null} />
                    </div>}
                    <PopupDialog
                        isOpen={isDeletePiece}
                        setIsOpen={setIsDeletePiece}
                        dialogTitle={`Delete Piece`}
                        dialogContent={`Are you sure you want to delete "${piece.id}"?`}
                        initInputValue={''}
                        confirmAction={onDelPiece}
                        dialogType='confirm'
                    />

                    {isOwner && piece.piece_type === "original" && <Link href={`/create-a-piece?edit_id=${piece.id}`}>
                        <IconButtonMid icon={<PencilIcon />} title={null} />
                    </Link>}

                    {isOwner && piece.piece_type !== "original" && <div onClick={() => setIsEditingPiece(true)}>
                        <IconButtonMid icon={<PencilIcon />} title={null} />
                    </div>}
                    <PopupDialog
                        isOpen={isEditingPiece}
                        setIsOpen={setIsEditingPiece}
                        dialogTitle='Editing Piece'
                        dialogContent=''
                        initInputValue={{
                            name: piece.name,
                            world_id: world.id,
                            type: piece.piece_type,
                            json_content: piece.piece_json,
                            folder_id: piece.folder_id,
                            tags: piece.tags
                        } as TypedPiece}
                        confirmAction={(inputValue: TypedPiece) => { update_special_piece(inputValue, piece.id) }}
                        dialogType="publish-special-piece"
                    />

                    {isOwner &&
                        <div className="relative z-10" onClick={() => setIsMoveFolder(true)}>
                            <IconButtonMid icon={<FolderIcon />} title={'Move'} />
                            {isMoveFolder && <DropDownMenu setDropdownVisible={setIsMoveFolder} options={folders} />}
                        </div>
                    }
                </div>

            </div>

            <div className='flex flex-col space-y-3 items-start'>

                {!preview && <CopyableID id_string="Piece ID" id={piece.id} />}

                <div id="title-group" className='w-full flex flex-row items-start justify-between'>
                    <FieldContentDisplay content={piece.name} textSize="text-4xl" bold="font-semibold" />
                </div>


                <div id="metadata-group" className="mt-2 w-full flex flex-col" >
                    <PieceMetadataDisplay piece={piece} world={world} folder={folder} />
                </div>


                {!preview && <div id="author-group" className="w-full flex flex-col max-w-2xl">
                    <AuthorDisplay author={author} bannerContent="Author" icon={isWorldOwner ? <CrownIcon className="text-brand" /> : null} />
                </div>}

                {piece.piece_type !== "original" && <div className="my-2 w-full rounded-xl bg-brand text-white text-sm py-2 px-4 font-mono font-medium flex flex-row space-x-2 items-center justify-center max-w-2xl">
                    <span>The following content is generated by </span>
                    <Link href={`/worlds/${world.id}/explore`}>
                        <span className="cursor-pointer bg-white text-brand font-semibold rounded-lg p-2 flex flex-row items-center space-x-1">
                            <StarsIcon className="w-3 h-3" />
                            <span className="whitespace-nowrap">Explore in AI</span>
                        </span>
                    </Link>
                </div>}

                {piece.piece_type !== "original" && <div className="w-full  flex flex-row items-center justify-between max-w-2xl space-x-2">
                    <Link href={`/worlds/${world.id}/explore?gen_type=prompt-gen&prompt_id=${piece.id}`} className="w-1/2  ">
                        <div className="w-full cursor-pointer  text-brand border border-brand rounded-lg py-2 px-2 flex flex-row items-center justify-center space-x-2">
                            <ArrowUpRight />
                            <span className="whitespace-nowrap  text-sm ">Try this Prompt</span>
                        </div>
                    </Link>
                    <Link href={`/worlds/${world.id}/explore?gen_type=prompt-gen&prequel=${piece.id}`} className="w-1/2 ">
                        <div className="w-full cursor-pointer  text-brand border border-brand  rounded-lg py-2 px-2 flex flex-row items-center justify-center space-x-2">
                            <ArrowUpRight />
                            <span className="whitespace-nowrap text-sm ">Make Sequel</span>
                        </div>
                    </Link>
                </div>}

                {piece.piece_type === "original" && <div id='image-display' className="w-full max-w-lg">
                    <PieceImages bucket="world" paths={(piece.piece_json as GeneralJson).images} popup={true} />
                </div>}

                {piece.piece_type === "original" ? <div id="content-group" className='w-full flex flex-row flex-wrap items-center justify-start'>
                    <Markdown className="text-base font-serif">
                        {(piece.piece_json as GeneralJson).content}
                    </Markdown>
                </div> :
                    <div>
                        <div id="content-group" className='w-full max-w-2xl flex flex-row flex-wrap items-center justify-start'>
                            {piece.piece_type == "gen-piece" ?
                                <GenPieceDisplay json_content={piece.piece_json as GenPieceJson} />
                                : <ChatHistoryDisplay json_content={piece.piece_json as ChatHistoryJson} />}
                        </div>
                    </div>
                }

                {(piece.piece_type === "gen-piece" || piece.piece_type === "roleplay") && (piece.piece_json as GenPieceJson).notes &&
                    <div id="notes-group" className='w-full flex flex-col items-start justify-center'>
                        <FieldTitleDisplay label={"notes"} textSize="text-sm" />
                        <Markdown className="text-base font-serif">
                            {(piece.piece_json as GenPieceJson).notes}
                        </Markdown>
                    </div>}

                {piece.tags.length > 0 && <div id="tags-group" className='w-full flex flex-col'>
                    <FieldTitleDisplay label={"tags"} textSize="text-sm" />
                    <TagsBarDisplay tags={piece.tags} preview={preview} />
                </div>}


                <div id="stats-group" className='flex flex-row text-base justify-between items-center  w-full'>
                    {user && user.id &&
                        <LikeButton initIsLiked={likes.some(like => user.id === like.user_id)} initLikes={likes.length} pid={piece.id} uid={user.id} />
                    }
                    <div id="date" className="flex flex-row items-center space-x-2">
                        {<div className="flex flex-row text-xs items-center space-x-1 ">
                            <CalendarIcon />
                            <span>Created {getDistanceToNow(piece.created_at)}</span>
                        </div>}
                        {piece.modified_at && <div className="flex flex-row text-xs items-center space-x-1 ">
                            <CalendarIcon />
                            <span>Updated {getDistanceToNow(piece.modified_at)}</span>
                        </div>}
                    </div>
                </div>

                <div className="hpx border-t w-full my-2">

                </div>

            </div >
        </>
    )
};



const PieceMetadataDisplay = ({ piece, world, folder }: { piece: Piece, world: World, folder: Folder | null }) => {
    return (
        <div className="flex flex-row w-full  justify-start items-center text-sm text-left font-medium">
            <span className="font-semibold text-foreground/50 mr-1">From World:</span>
            <Link href={`/worlds/${world.id}`}>
                <div className="cursor-pointer flex flex-row items-center justify-start space-x-1  hover:text-brand">
                    <BookIcon className="flex-shrink-0" />
                    <div className="overflow-hidden whitespace-nowrap overflow-ellipsis ">{world.name}</div>
                    {/* <span className="flex flex-row"><SingleUserIcon /><PencilIcon /></span> */}
                </div>
            </Link>
            {folder && <SlashIcon className="flex-shrink-0" />}
            {folder && <Link href={`/worlds/${world.id}/pieces?folder_id=${folder.id}`}>
                <div className="cursor-pointer flex flex-row items-center justify-start space-x-1  hover:text-brand">
                    <FolderIcon className="flex-shrink-0" />
                    <span className="overflow-hidden  whitespace-nowrap overflow-ellipsis">{folder.name}</span>
                </div>
            </Link>}
        </div>

    )
}