'use client'
import { World } from "@/types/types";
import SwitchGroups from "@/components/ui/menu/radio-group";
import type { Option } from "@/components/ui/menu/radio-group";
import PromptGen from "./PromptGen";
import { PencilIcon, SingleUserIcon } from '@/components/icon/icon';
import { useState } from "react";
import Roleplay from "./Roleplay";

import { DraftProvider } from '@/app/create-a-piece/draft-provider';
import Simulation from "./Simulation";

export default function ExploreWorld({ world }: { world: World }) {
    const options: Option[] = [
        { id: 1, name: "Write Stories", icon: <PencilIcon />, page: <PromptGen world={world} /> },
        { id: 2, name: "Roleplay", icon: <SingleUserIcon />, page: <Roleplay world={world} /> },
        { id: 3, name: "Simulation", icon: <SingleUserIcon />, page: <Simulation world={world} /> },
    ];

    const [selectedOption, setSelectedOption] = useState(options[0])

    return <DraftProvider>
        <div className="w-full flex flex-col space-y-6 items-start">
            <div className="w-full flex flex-col overflow-x-auto md:items-center md:justify-center">
                <SwitchGroups options={options} onTabChange={(option: Option) => { setSelectedOption(option) }} />
            </div>

            {selectedOption.page}
        </div>
    </DraftProvider>
}