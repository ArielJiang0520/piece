import { FieldTitleDisplay } from "@/components/ui/display/display-helpers";
import DropDownSelector from "@/components/ui/input/DropDownSelector";
import { World } from "@/types/types";
import { useState, useRef, useEffect } from "react";
import { capitalize } from "@/utils/helpers";
import ChatBoxSimulation from "./ChatBoxSimulation";
import { ResetIcon } from "@/components/icon/icon";
import { TextInput } from "@/components/ui/input/InputTextField";

export default function Simulation({ world }: { world: World }) {
    const worldChars = world.characters.map((char, idx) => { return { id: idx, name: char } })

    const [aiChar1, setAiChar1] = useState<{ [key: string]: any }>(worldChars[0])
    const [aiChar2, setAiChar2] = useState<{ [key: string]: any }>(worldChars[0])
    const [scenario, setScenario] = useState('')
    const [openingMsg, setOpeningMsg] = useState('')

    const [chatOpen, setChatOpen] = useState(false)

    return (
        <>
            {!chatOpen && <div className="flex flex-col space-y-2 items-center w-full">
                <FieldTitleDisplay label={"AI 1's character"} />
                <DropDownSelector data={worldChars} nameKey="name" width="w-56"
                    selected={aiChar1} setSelected={setAiChar1}
                    display_func={(char) => capitalize(char.name)}
                />

                <FieldTitleDisplay label={"AI 2's character"} />
                <DropDownSelector data={worldChars} nameKey="name" width="w-56"
                    selected={aiChar2} setSelected={setAiChar2}
                    display_func={(char) => capitalize(char.name)}
                />


                <FieldTitleDisplay label={"Scenario"} />
                <textarea
                    className="max-w-2xl multiLineInput  text-base rounded-md border px-2 py-6 overflow-y-auto"
                    rows={4}
                    value={scenario}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setScenario(e.target.value)}
                    placeholder="(optional) Describe the scenario of this simulation"
                />

                <FieldTitleDisplay label={"AI 1's Opening"} />
                <textarea
                    className="max-w-2xl multiLineInput  text-base rounded-md border px-2 py-6 overflow-y-auto"
                    rows={2}
                    value={openingMsg}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOpeningMsg(e.target.value)}
                    placeholder="Write an opening message for AI 1 to start the conversation"
                />
            </div>}

            {!chatOpen && <button
                className="primaryButton p-2 w-40 text-sm my-8 self-center"
                onClick={() => setChatOpen(true)}
            >
                Confirm
            </button>}

            {chatOpen && <div className="flex flex-row justify-between w-full border-t border-b py-4">
                <div className="flex flex-row space-x-3 text-xs whitespace-nowrap capitalize">
                    <span>AI 1: <span className="bg-foreground/10 py-1 px-1">{aiChar1.name}</span></span>
                    <span>AI 2: <span className="bg-foreground/10 py-1 px-1">{aiChar2.name}</span></span>
                </div>
                <div className="text-foreground/50">
                    <ResetIcon className="cursor-pointer w-3" onClick={() => setChatOpen(false)} />
                </div>

            </div>}

            {chatOpen && <ChatBoxSimulation world={world} aiRole1={aiChar1.name} aiRole2={aiChar2.name} scenario={scenario} openingMsg={openingMsg} />}


        </>
    )
}