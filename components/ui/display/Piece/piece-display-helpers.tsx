import { FieldTitleDisplay, Markdown } from "../display-helpers"
import { ChatHistoryJson, TypedPiece, GenPieceJson } from "@/types/types"
import { RobotIcon, ArrowUpRight } from "@/components/icon/icon"
import Link from "next/link"
import { CopyableID } from "../../button/button-helpers"

export function ChatHistoryDisplay({ json_content }: { json_content: ChatHistoryJson }) {
    return <div className="flex flex-col space-y-6">
        <div id="scenario-group" className='w-full flex flex-col space-y-1'>
            <FieldTitleDisplay label={"scenario"} textSize="text-base" />
            <div className='border-t border-b px-4 py-2 prose prose-sm bg-foreground/5'>{json_content.scenario}</div>
        </div>

        <div className='w-full flex flex-col space-y-3'>
            <div className='flex flex-row items-center space-x-2'>
                <FieldTitleDisplay label={"chat history"} textSize="text-base" />
                <RobotIcon className="text-brand" />
            </div>
            {json_content.output.map((msg: { role: string, content: string }, index: number) =>
                <div key={index} className='w-full flex flex-col space-y-2'>
                    <div className='font-xs capitalize '>{msg.role} {index % 2 == 0 ? "(User)" : "(AI)"}</div>
                    <div className={`border-t border-b px-4 py-2 prose prose-sm ${index % 2 == 0 ? 'bg-foreground/10' : 'bg-foreground/5'}`}>{msg.content}</div>
                </div>
            )}
        </div>
    </div>
}


export function GenPieceDisplay({ json_content, prompt = null }: { json_content: GenPieceJson, prompt?: null | string }) {
    return <div className="flex flex-col space-y-6">
        {json_content.prequel && <div className='w-full flex flex-col space-y-3 items-start'>
            <FieldTitleDisplay label={"prequel"} textSize="text-base" />
            <Link href={`/pieces/${json_content.prequel}`}>
                <CopyableID id={json_content.prequel} id_string={"Piece ID"} />
            </Link>
        </div>}

        <div className='w-full flex flex-col space-y-3'>
            <div className="flex flex-row justify-between items-center space-x-2">
                <FieldTitleDisplay label={"prompt"} textSize="text-base" />
                {prompt && <Link href={`/prompts/${prompt}`} className="flex flex-row justify-start ">
                    <div className="flex flex-row items-center space-x-1 text-xs rounded-xl border px-3 py-1">
                        <span>See other pieces with this prompt</span>
                        <ArrowUpRight />
                    </div>
                </Link>}
            </div>
            <div className='border-t border-b px-4 py-2 text-sm text-foreground bg-foreground/5'>
                <Markdown>{json_content.prompt}</Markdown>
            </div>


        </div>

        <div className='w-full flex flex-col space-y-3'>
            <div className='flex flex-row items-center space-x-2'>
                <FieldTitleDisplay label={"content"} textSize="text-base" />
                <RobotIcon className="text-brand" />
            </div>
            <div className='border-t border-b px-4 py-2 text-sm bg-foreground/5'>
                <Markdown>{json_content.output}</Markdown>
            </div>
        </div>
    </div>

}