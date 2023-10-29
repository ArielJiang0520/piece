'use client'
import { PieceDetails, FolderCount, PromptMetadata } from "@/app/supabase-server"
import { Piece, Profile, Folder, DefaultFolder, World, Prompt } from "@/types/types";
import { FieldContentDisplay, Markdown } from "@/components/ui/display/display-helpers";
import PieceCard from "@/components/ui/display/Piece/PieceCard";
import { Disclosure } from '@headlessui/react'
import { ArrowUpRight, CalendarIcon, AtomIcon } from "@/components/icon/icon";
import { getDistanceToNow } from "@/utils/helpers";
import Link from "next/link";
import { useEffect, useState } from "react";
import DropDownSelector from "@/components/ui/input/DropDownSelector";
import cloneDeep from 'lodash/cloneDeep';
interface PromptWorldPiecesProps {
    world: World,
    prompts: PromptMetadata[],
}
export function PromptWorldPieces({ world, prompts }: PromptWorldPiecesProps) {
    const [filteredPrompts, setFilteredPrompts] = useState(prompts)
    const [currentSort, setCurrentSort] = useState<SortFunc>(sortFunc[0])

    useEffect(() => {
        let updatedPrompts = cloneDeep(prompts)
        updatedPrompts = updatedPrompts.sort(currentSort.myFunc)
        setFilteredPrompts(updatedPrompts)
    }, [currentSort])

    return <div className="w-full flex flex-col  font-mono space-y-2">
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
                {`${filteredPrompts.length} prompts found.`}
            </div>
        </div>
        {
            filteredPrompts.map(promptP => {
                const { pieces: pieceCount, ...prompt } = promptP
                const count = pieceCount[0].count as number
                return <Link href={`/prompts/${prompt.id}`}>
                    <PromptCard worldId={world.id} prompt={prompt} numPieces={count} />
                </Link>
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
    return <div className="w-full flex flex-col space-y-4 rounded-lg bg-foreground/5 p-4 ">
        <div className="flex flex-row items-center justify-between space-x-1 font-mono text-sm text-foreground/80  ">
            <Link href={`/worlds/${worldId}/explore?gen_type=prompt-gen&prompt_id=${prompt.id}`}>
                <div className=" cursor-pointer  text-brand border border-brand rounded-lg py-1 px-2 flex flex-row items-center justify-center space-x-1">
                    <ArrowUpRight />
                    <span className="whitespace-nowrap  text-sm ">Try this Prompt</span>
                </div>
            </Link>
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