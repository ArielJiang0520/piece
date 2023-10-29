'use client'
import { Piece, World } from "@/types/types";
import { Markdown } from "../display-helpers";
import { PromptDetails } from "@/app/supabase-server";
import { FieldTitleDisplay } from "../display-helpers";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BackIcon, ArrowUpRight } from "@/components/icon/icon";
import { useState } from "react";

const PiecesMasonry = dynamic(() => import('@/components/ui/display/Piece/PiecesMasonry'), {
    ssr: false
});

interface PromptDisplayProps {
    prompt: PromptDetails,
    world: World
}
export function PromptDisplay({ prompt, world }: PromptDisplayProps) {
    const [pieces, setPieces] = useState(prompt.pieces.sort((a: Piece, b: Piece) => {
        const dateA = a.created_at;
        const dateB = b.created_at;
        // For descending order (latest to oldest)
        return dateB.localeCompare(dateA);
    }));

    return <div className="w-full flex flex-col  space-y-4">
        <Link id="back-button" href={`/worlds/${world.id}/prompts`}>
            <div className="flex flex-row justify-start items-center space-x-2 text-sm font-medium text-foreground/50 hover:text-foreground">
                <BackIcon />
                <div>
                    All prompts in this world
                </div>
            </div>
        </Link>
        <div className="flex flex-row items-center  text-left ">
            <div className='w-full flex flex-col space-y-3'>
                <div className="flex flex-row justify-start items-center space-x-2">
                    <FieldTitleDisplay label={"prompt"} textSize="text-base" />

                </div>
                <div className='border-t border-b px-4 py-2 text-sm text-foreground bg-foreground/5'>
                    <Markdown>{prompt.prompt}</Markdown>
                </div>
            </div>
        </div>

        <Link href={`/worlds/${world.id}/explore?gen_type=prompt-gen&prompt_id=${prompt.id}`}>
            <div className=" cursor-pointer  text-brand border border-brand rounded-lg py-3 px-2 flex flex-row items-center justify-center space-x-1">
                <ArrowUpRight />
                <span className="whitespace-nowrap  text-base ">Try this Prompt</span>
            </div>
        </Link>

        <div className="flex flex-col">
            <div className="flex flex-row w-full justify-start items-center p-1">
                <div className="font-mono text-xs font-medium">
                    {`${pieces.length} pieces found.`}
                </div>
            </div>
            <PiecesMasonry pieces={pieces} world={world} />
        </div>

    </div>
}