import { FieldTitleDisplay } from "@/components/ui/display/display-helpers";
import DropDownSelector from "@/components/ui/input/DropDownSelector";
import { World } from "@/types/types";
import { useState, useRef, useEffect } from "react";
import { capitalize } from "@/utils/helpers";
import ChatBox from "./ChatBox";
import { ResetIcon } from "@/components/icon/icon";
import { TextInput } from "@/components/ui/input/InputTextField";

export default function Roleplay({ world }: { world: World }) {
    const worldChars = world.characters.map((char, idx) => { return { id: idx, name: char } })

    const [playerChar, setPlayerChar] = useState<{ [key: string]: any }>(worldChars[0])
    const [aiChar, setAiChar] = useState<{ [key: string]: any }>(worldChars[0])
    const [scenario, setScenario] = useState('')

    const [chatOpen, setChatOpen] = useState(false)

    return (
        <>
            {!chatOpen && <div className="flex flex-col space-y-2 items-center w-full">
                <FieldTitleDisplay label={"your character"} />
                <DropDownSelector data={worldChars} nameKey="name" width="w-56"
                    selected={playerChar} setSelected={setPlayerChar}
                    display_func={(char) => capitalize(char.name)}
                />

                <FieldTitleDisplay label={"AI's character"} />
                <DropDownSelector data={worldChars} nameKey="name" width="w-56"
                    selected={aiChar} setSelected={setAiChar}
                    display_func={(char) => capitalize(char.name)}
                />


                <FieldTitleDisplay label={"Scenario"} />
                <textarea
                    className="max-w-2xl multiLineInput  text-base rounded-md border px-2 py-6 h-40 overflow-y-auto"
                    value={scenario}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setScenario(e.target.value)}
                    placeholder="(optional) Describe the scenario of this roleplay"
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
                    <span>You: <span className="bg-foreground/10 py-1 px-1">{playerChar.name}</span></span>
                    <span>AI: <span className="bg-foreground/10 py-1 px-1">{aiChar.name}</span></span>
                </div>
                <div className="text-foreground/50">
                    <ResetIcon className="cursor-pointer w-3" onClick={() => setChatOpen(false)} />
                </div>

            </div>}

            {chatOpen && <ChatBox world={world} userRole={playerChar.name} aiRole={aiChar.name} scenario={scenario} />}


        </>
    )
}