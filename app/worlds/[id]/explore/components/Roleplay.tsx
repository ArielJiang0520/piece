import { FieldTitleDisplay } from "@/components/ui/display/display-helpers";
import DropDownSelector from "@/components/ui/input/DropDownSelector";
import { World } from "@/types/types";
import { useState } from "react";
import { capitalize } from "@/utils/helpers";


type Message = {
    role: "user" | "assistant",
    content: string
}



export default function Roleplay({ world }: { world: World }) {
    const worldChars = world.characters.map((char, idx) => { return { id: idx, name: char } })

    const [playerChar, setPlayerChar] = useState<any>(worldChars[0])
    const [aiChar, setAiChar] = useState<any>(worldChars[0])

    const [messages, setMessages] = use

    return (
        <div className="flex flex-col space-y-2 items-center w-full">
            <FieldTitleDisplay label={"your character"} />
            <DropDownSelector data={worldChars} nameKey="name" width="w-56"
                selected={playerChar} setSelected={setPlayerChar}
                display_func={(char) => capitalize(char.name)}
            />

            <FieldTitleDisplay label={"the AI's character"} />
            <DropDownSelector data={worldChars} nameKey="name" width="w-56"
                selected={aiChar} setSelected={setAiChar}
                display_func={(char) => capitalize(char.name)}
            />
        </div>
    )
}