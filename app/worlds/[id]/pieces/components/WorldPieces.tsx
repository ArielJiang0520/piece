'use client'
import { Piece, Profile, Folder, DefaultFolder, World } from "@/types/types";
import SearchBar from "@/components/ui/input/SearchBar";
import useHorizontalDragScroll from '@/hooks/useHorizontalScroll';
import { useEffect, useState, useRef } from 'react';
import Link from "next/link";
import DropDownSelector from "@/components/ui/input/DropDownSelector";
import dynamic from 'next/dynamic';
import { FieldTitleDisplay } from "@/components/ui/display/display-helpers";
import { AtomIcon, FilledStarIcon, FolderIcon, NineDotsIcon, PencilIcon, PlusIcon, SlashIcon, StarIcon, TrashIcon } from "@/components/icon/icon";
import { HelpTooltip } from "@/components/ui/widget/tooltip";
import PopupDialog from "@/components/ui/input/PopupDialog";
import { delete_folder, insert_folder, update_folder_name } from "@/utils/folder-helpers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import cloneDeep from 'lodash/cloneDeep';
import { FolderCount, PieceDetails } from "@/app/supabase-server";
import { notify_error, notify_success } from "@/components/ui/widget/toast";

const PiecesMasonry = dynamic(() => import('@/components/ui/display/Piece/PiecesMasonry'), {
    ssr: false
});

type SortFunc = { id: number, name: string, myFunc: (a: Piece, b: Piece) => number }

const sortFunc: SortFunc[] = [
    {
        id: 1,
        name: "Latest",
        myFunc: (a: Piece, b: Piece) => {
            const dateA = a.created_at;
            const dateB = b.created_at;
            // For descending order (latest to oldest)
            return dateB.localeCompare(dateA);
        }
    },
    {
        id: 2,
        name: "Oldest",
        myFunc: (a: Piece, b: Piece) => {
            const dateA = a.created_at;
            const dateB = b.created_at;
            // For ascending order 
            return dateA.localeCompare(dateB);
        }
    }
]

interface WorldPiecesProps {
    world: World,
    pieces: PieceDetails[],
    folders: FolderCount[],
    isOwner: boolean
}

export default function WorldPieces({ pieces, world, folders, isOwner }: WorldPiecesProps) {
    const { startDrag, stopDrag, doDrag } = useHorizontalDragScroll();

    const [filteredPieces, setFilteredPieces] = useState<PieceDetails[]>(pieces);

    const defaultFolder = {
        id: 'default',
        name: 'All',
        pieces: [{ count: pieces.length }],
        created_at: Number.MAX_SAFE_INTEGER.toString()
    } as DefaultFolder

    const favoriteFolder = {
        id: 'favorite',
        name: 'Favorite',
        pieces: [{ count: pieces.filter(piece => piece.is_favorite).length }],
        created_at: (Number.MAX_SAFE_INTEGER - 1).toString()
    }

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const allFolders: Array<FolderCount | DefaultFolder> = [defaultFolder, favoriteFolder, ...folders].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    const [currentFolder, setCurrentFolder] = useState<FolderCount | DefaultFolder>(defaultFolder)
    const [isCreateFolder, setIsCreateFolder] = useState(false);
    const [isRenameFolder, setIsRenameFolder] = useState(false);
    const [isDeleteFolder, setIsDeleteFolder] = useState(false);

    const [currentSort, setCurrentSort] = useState<SortFunc>(sortFunc[0])

    useEffect(() => {
        const folder_id = searchParams.get('folder_id')
        let updatedPieces = cloneDeep(pieces)
        if (!folder_id) {
            setCurrentFolder(defaultFolder)
            updatedPieces = updatedPieces.sort(currentSort.myFunc)
            setFilteredPieces(updatedPieces);
        } else if (folder_id === "favorite") {
            setCurrentFolder(favoriteFolder)
            updatedPieces = updatedPieces.filter((piece) => piece.is_favorite)
            updatedPieces = updatedPieces.sort(currentSort.myFunc)
            setFilteredPieces(updatedPieces);
        }
        else {
            const folder = folders.find((folder) => folder.id === folder_id)
            if (folder) {
                setCurrentFolder(folder)
                updatedPieces = updatedPieces.filter((piece) => piece.folder_id === folder_id)
                updatedPieces = updatedPieces.sort(currentSort.myFunc)
                setFilteredPieces(updatedPieces);
            }
            else
                notify_error(`Did not find folder ${folder_id}`)
        }
    }, [searchParams, currentSort])

    return (
        <div className="w-full  flex flex-col space-y-4 font-mono">
            <div className="w-full flex flex-col space-y-4 items-start justify-center p-1">
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center justify-start space-x-1">
                        <FieldTitleDisplay label="view by folder" textSize="text-sm" />
                        <SlashIcon />
                        <div className="flex flex-row items-center space-x-1 text-base text-brand font-semibold">
                            <FolderIcon />
                            <span>{currentFolder.name}</span>
                        </div>
                    </div>

                    {isOwner && currentFolder.id !== "default" && <div className="flex flex-row items-center space-x-2 justify-end text-foreground/50">
                        <PencilIcon className="cursor-pointer" onClick={() => setIsRenameFolder(true)} />
                        <TrashIcon className="cursor-pointer" onClick={() => setIsDeleteFolder(true)} />
                    </div>}
                    {/* <HelpTooltip tooltipText="Pieces are divided into boards for better categorization. Boards are created and managed by the world creator." /> */}
                </div>

                <div className="w-full flex flex-row space-x-2 horizontal-scroll hide-scrollbar"
                    onMouseDown={startDrag}
                    onMouseLeave={stopDrag}
                    onMouseUp={stopDrag}
                    onMouseMove={doDrag}
                >
                    {allFolders.map((folder, idx) =>
                        <Link key={idx} href={folder.id === 'default' ? `${pathname}` : `${pathname}?folder_id=${folder.id}`} >
                            <div key={idx} className={`h-15 cursor-pointer flex flex-row items-center justify-center rounded-lg p-5 space-x-2  border min-w-[100px] max-w-xl
                                        ${currentFolder.id === folder.id ? "bg-brand text-white border-brand" : "text-foreground/50"} `}
                            >
                                {folder.id === "favorite" && <FilledStarIcon className="text-yellow-400" />}
                                {folder.id === "default" && <NineDotsIcon className={`${currentFolder.id === folder.id ? "text-white" : "text-brand"}`} />}
                                <span className={`text-sm font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis`}>
                                    {folder.name}
                                </span>
                                <div className={`ml-1 px-2 py-1 rounded-full text-xs ${currentFolder.id === folder.id ? "bg-foreground/50" : "bg-foreground/10"}`}>
                                    {folder.pieces[0].count}
                                </div>
                            </div>
                        </Link>)}

                    {isOwner && <div
                        className={`h-15 cursor-pointer flex flex-row items-center justify-center rounded-lg p-5 space-x-1  border  w-[100px] text-brand border-brand`}
                        onClick={() => setIsCreateFolder(true)}
                    >
                        <PlusIcon className="" />
                        <span className={`whitespace-nowrap text-sm font-semibold`}>
                            New
                        </span>
                    </div>}
                </div>
            </div>

            <div className="hpx border-4 rounded-full border-t my-6 px-4 border-brand"></div>

            <div id="search-bar" className="flex flex-col md:flex-row md:items-center  ">
                <div className="flex flex-row items-center space-x-2 order-1 md:order-2 ">

                    <Link href={`/create-a-piece?world_id=${world.id}`}>
                        <button className="flex flex-row items-center space-x-1 w-full md:w-auto mb-4 md:mb-0 text-base px-3 py-2 primaryButton rounded-lg">
                            <PencilIcon />
                            <span>Create a Piece</span>
                        </button>
                    </Link>

                    <Link href={`/worlds/${world.id}/explore`}>
                        <button className="flex flex-row items-center space-x-1  w-full md:w-auto mb-4 md:mb-0 text-base px-3 py-2 primaryButton-pink rounded-lg">
                            <AtomIcon />
                            <span>Use AI Generate</span>
                        </button>
                    </Link>
                </div>
                <div className="flex-grow w-full md:mr-4 order-2 md:order-1 z-30">
                    <SearchBar
                        candidates={[]}
                        nameKey="name"
                        placeholder={"Filter by tag"}
                        onSelect={() => { }}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col md:flex-row md:item-center md:justify-between text-sm p-1">
                    <div className="flex  items-center md:w-auto space-x-2">
                        <span className="">Sort by</span>
                        <span className="z-20">
                            <DropDownSelector
                                data={sortFunc}
                                selected={currentSort}
                                setSelected={setCurrentSort}
                                width="w-40"
                                nameKey="name"
                            />
                        </span>
                    </div>
                </div>

                <div className="flex flex-row w-full justify-start items-center p-1">
                    <div className="font-mono text-xs font-medium">
                        {`${filteredPieces.length} pieces found.`}
                    </div>
                </div>
                <PiecesMasonry pieces={filteredPieces} world={world} />
            </div>

            <PopupDialog
                isOpen={isCreateFolder}
                setIsOpen={setIsCreateFolder}
                dialogTitle={"Create New Folder"}
                dialogContent={""}
                initInputValue={''}
                confirmAction={(name: string) => { insert_folder(name, world.id); router.refresh(); }}
                dialogType='input'
            />
            <PopupDialog
                isOpen={isRenameFolder}
                setIsOpen={setIsRenameFolder}
                dialogTitle={`Rename "${currentFolder.name}" Folder`}
                dialogContent={"New name:"}
                initInputValue={currentFolder.name}
                confirmAction={(newName: string) => { update_folder_name(currentFolder.id, newName); router.refresh(); notify_success("Folder successfully renamed!") }}
                dialogType='input'
            />
            <PopupDialog
                isOpen={isDeleteFolder}
                setIsOpen={setIsDeleteFolder}
                dialogTitle={`Delete "${currentFolder.name}" Folder`}
                dialogContent={`Are you sure you want to delete this folder in "${world.name}"?`}
                initInputValue={currentFolder.id}
                confirmAction={(id: string) => { delete_folder(id); router.refresh(); notify_success("Folder successfully deleted!") }}
                dialogType='confirm'
            />
        </div>
    );
}
