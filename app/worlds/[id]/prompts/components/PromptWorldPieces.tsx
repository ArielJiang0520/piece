'use client'
import { PieceDetails, FolderCount, PromptMetadata } from "@/app/supabase-server"
import { Piece, Profile, Folder, DefaultFolder, World, Prompt } from "@/types/types";
import { FieldContentDisplay, Markdown } from "@/components/ui/display/display-helpers";
import { ArrowUpRight, CalendarIcon, AtomIcon, FilledStarIcon, NineDotsIcon, StarIcon } from "@/components/icon/icon";
import { getDistanceToNow } from "@/utils/helpers";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import DropDownSelector from "@/components/ui/input/DropDownSelector";
import cloneDeep from 'lodash/cloneDeep';
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { notify_error, notify_success } from "@/components/ui/widget/toast";
import useHorizontalDragScroll from "@/hooks/useHorizontalScroll";
import { IconButtonMid } from "@/components/ui/button/button-helpers";
import { fav_prompt, unfav_prompt } from "@/utils/prompt-helpers";

interface PromptWorldPiecesProps {
    world: World,
    prompts: PromptMetadata[],
}
export function PromptWorldPieces({ world, prompts }: PromptWorldPiecesProps) {
    const { startDrag, stopDrag, doDrag } = useHorizontalDragScroll();

    const defaultFolder = {
        id: 'default',
        name: 'All',
        pieces: [{ count: prompts.length }],
    } as DefaultFolder

    const favoriteFolder = {
        id: 'favorite',
        name: 'Favorite',
        pieces: [{ count: prompts.filter(prompt => prompt.is_favorite).length }],
    } as DefaultFolder

    const allFolders: Array<DefaultFolder> = [defaultFolder, favoriteFolder]
    const [currentFolder, setCurrentFolder] = useState<DefaultFolder>(allFolders[0])
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filteredPrompts, setFilteredPrompts] = useState(prompts)
    const [currentSort, setCurrentSort] = useState<SortFunc>(sortFunc[0])

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(Array.from(searchParams.entries()));
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    useEffect(() => {
        let updatedPrompts = cloneDeep(prompts)

        const folder_id = searchParams.get('folder_id')
        if (!folder_id || folder_id === "default") {

        } else if (folder_id === "favorite") {
            updatedPrompts = updatedPrompts.filter((prompt) => prompt.is_favorite)
        }
        else {
            notify_error(`Did not find folder ${folder_id}`)
        }

        const sort_by = searchParams.get('sort_by')
        if (!sort_by) {
            updatedPrompts = updatedPrompts.sort(sortFunc[0].myFunc)
        } else {
            const sort = sortFunc.find(item => item.name.toLocaleLowerCase().replace(/\s/g, "_") === sort_by)
            if (sort) {
                updatedPrompts = updatedPrompts.sort(sort.myFunc)
            } else {
                notify_error(`Did not find sort_by ${sort_by}`)
            }
        }

        setFilteredPrompts(updatedPrompts)
    }, [searchParams])

    return <div className="w-full flex flex-col  font-mono space-y-2">
        <div className="w-full flex flex-row space-x-2 horizontal-scroll hide-scrollbar"
            onMouseDown={startDrag}
            onMouseLeave={stopDrag}
            onMouseUp={stopDrag}
            onMouseMove={doDrag}
        >
            {allFolders.map((folder, idx) =>
                <div key={idx}
                    className={`h-15 cursor-pointer flex flex-row items-center justify-center rounded-lg p-5 space-x-2  border min-w-[100px] max-w-xl 
                            ${currentFolder.id === folder.id ? "bg-brand text-white border-brand" : "text-foreground/50"} `}
                    onClick={() => {
                        setCurrentFolder(folder)
                        router.push(pathname + '?' + createQueryString('folder_id', folder.id))
                    }}
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
            )}
        </div>
        <div className="flex flex-col md:flex-row md:item-center md:justify-between text-sm p-1">
            <div className="flex  items-center md:w-auto space-x-2">
                <span className="">Sort by</span>
                <span className="z-20">
                    <DropDownSelector
                        data={sortFunc}
                        selected={currentSort}
                        setSelected={(sel) => {
                            router.push(pathname + '?' + createQueryString('sort_by', sel.name.toLocaleLowerCase().replace(/\s/g, "_")))
                            setCurrentSort(sel)
                        }}
                        width="w-40"
                        nameKey="name"
                    />
                </span>
            </div>
        </div>

        <div className="flex flex-row w-full justify-start items-center p-1">
            <div className="font-mono text-xs font-medium">
                {`${filteredPrompts.length} prompts found.`}
            </div>
        </div>
        {
            filteredPrompts.map(promptP => {
                const { pieces: pieceCount, ...prompt } = promptP
                const count = pieceCount[0].count as number
                return <Link key={prompt.id} href={`/prompts/${prompt.id}`}><PromptCard worldId={world.id} prompt={prompt} numPieces={count} /></Link>

            })
        }
    </div>
}

type SortFunc = { id: number, name: string, myFunc: (a: PromptMetadata, b: PromptMetadata) => number }

const sortFunc: SortFunc[] = [
    {
        id: 1,
        name: "Latest",
        myFunc: (a: PromptMetadata, b: PromptMetadata) => {
            const dateA = a.updated_at;
            const dateB = b.updated_at;
            // For descending order (latest to oldest)
            return dateB.localeCompare(dateA);
        }
    },
    {
        id: 2,
        name: "Oldest",
        myFunc: (a: PromptMetadata, b: PromptMetadata) => {
            const dateA = a.updated_at;
            const dateB = b.updated_at;
            // For descending order (latest to oldest)
            return dateA.localeCompare(dateB);
        }
    },
    {
        id: 3,
        name: "Most Used",
        myFunc: (a: PromptMetadata, b: PromptMetadata) => {
            return b.pieces[0].count - a.pieces[0].count
        }
    }
]

interface PromptCardProps {
    worldId: string,
    prompt: Prompt
    numPieces: number
}
function PromptCard({ worldId, prompt, numPieces }: PromptCardProps) {
    const [isFav, setIsFav] = useState(prompt.is_favorite)
    const router = useRouter();

    const onFavPrompt = async () => {
        if (!isFav) {
            await fav_prompt(prompt.id)
            notify_success(`Favorited prompt successfully`)
        } else {
            await unfav_prompt(prompt.id)
            notify_success(`Un-favorited prompt successfully`)
        }
    }

    return <div className="w-full flex flex-col space-y-4 rounded-lg bg-foreground/5 p-4 ">
        <div className="flex flex-row items-center justify-between space-x-1 font-mono text-sm text-foreground/80  ">

            <button className=" bg-white text-brand border border-brand rounded-lg py-1 px-2 flex flex-row items-center justify-center space-x-1"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    router.push(`/worlds/${worldId}/explore?gen_type=prompt-gen&prompt_id=${prompt.id}`)
                }}>
                <ArrowUpRight />
                <span className="whitespace-nowrap  text-sm ">Try this Prompt</span>
            </button>

            <div className="text-yellow-500" onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsFav(!isFav);
                onFavPrompt();
            }}>
                <IconButtonMid icon={isFav ? <FilledStarIcon /> : <StarIcon />} title={null} />
            </div>
        </div>


        <div className="flex flex-row items-center  text-left ">
            <div className='border-t border-b px-2 py-2 font-mono text-sm text-foreground bg-foreground/5 w-full'>
                <Markdown>
                    {prompt.prompt}
                </Markdown>
            </div>
        </div>


        <div className="flex flex-row text-xs items-center space-x-1 justify-between">
            <div className="flex flex-row items-center space-x-1">
                <AtomIcon />
                <div className="whitespace-nowrap">
                    {`${numPieces} Pieces`}
                </div>
            </div>
            {prompt.updated_at && <div className="flex flex-row text-xs items-center space-x-1 justify-end">
                <CalendarIcon />
                <span>Updated {getDistanceToNow(prompt.updated_at)}</span>
            </div>}
        </div>

    </div>
}