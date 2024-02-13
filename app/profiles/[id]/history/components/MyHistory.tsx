'use client'
import { GenPieceJson, PromptHistory } from "@/types/types";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BookIcon, ForwardIcon, PointingArrowIcon, SendIcon } from "@/components/icon/icon";
import { Markdown } from "@/components/ui/display/display-helpers";
import { CalendarIcon } from "@/components/icon/icon";
import { getDistanceToNow } from "@/utils/helpers";
import { PromptHistoryMetadata } from "@/app/supabase-server";

export default function MyHistory({ history }: { history: PromptHistoryMetadata[] }) {
    return <>
        <div className="flex flex-col space-y-2">
            {history.map((entry, idx) => <HistoryCard key={idx} promptHistory={entry} />)}
        </div>
    </>
}

interface HistoryCardProps {
    promptHistory: PromptHistoryMetadata
}
function HistoryCard({ promptHistory }: HistoryCardProps) {
    const router = useRouter();


    return <div className="w-full flex flex-col space-y-4 rounded-lg bg-foreground/5 p-4 ">
        {/* <div className="flex flex-row items-center justify-between space-x-1 font-mono text-sm text-foreground/80  ">

            <button className=" bg-white text-brand border border-brand rounded-lg py-1 px-2 flex flex-row items-center justify-center space-x-1"
                onClick={(e) => {
                    // e.stopPropagation();
                    // e.preventDefault();
                    // router.push(`/worlds/${history.world_id}/explore?gen_type=prompt-gen&prompt_id=${prompt.id}`)
                }}>
                <ArrowUpRight />
                <span className="whitespace-nowrap  text-sm ">Generate Again</span>
            </button>
        </div> */}

        <button className="flex flex-row text-xs items-center space-x-1 justify-start"
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                router.push(`/worlds/${promptHistory.worlds!.id}`)
            }}
        >

            <div className="flex flex-row text-sm  items-center space-x-1 justify-end">
                <BookIcon />
                <span>{promptHistory.worlds!.name}</span>
            </div>

            <ForwardIcon />
        </button>


        <div className="flex flex-row items-center  text-left ">
            <div className='border-t border-b px-2 py-2 font-mono text-sm text-foreground bg-foreground/5 w-full'>
                <Markdown>
                    {(promptHistory.json_content as GenPieceJson).prompt}
                </Markdown>
            </div>
        </div>


        <div className="flex flex-row text-xs items-center space-x-1 justify-between">

            <div className="flex flex-row text-xs items-center space-x-1 justify-end">
                <CalendarIcon />
                <span>Generated {getDistanceToNow(promptHistory.created_at)}</span>
            </div>
        </div>

    </div>
}