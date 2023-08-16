'use client'
import { World } from "@/types/types.world";
import SwitchGenTypes from "./SwitchGenTypes";
import type { Option } from "./SwitchGenTypes";
import PromptGen from "./PromptGen";
import PeekWorld from "@/components/ui/display/World/PeekWorld";
import { PencilIcon, SingleUserIcon } from '@/components/icon/icon';
import { useState } from "react";


export default function ExploreWorld({ world }: { world: World }) {
    const options: Option[] = [
        { id: 1, name: "Write Stories", icon: <PencilIcon />, page: <PromptGen world={world} /> },
        { id: 2, name: "Roleplay", icon: <SingleUserIcon />, page: <></> },
    ];

    const [selectedOption, setSelectedOption] = useState(options[0])

    return <div className="w-full flex flex-col space-y-6 items-start">
        {/* <PeekWorld world={world} /> */}
        <div id="tab-group" className='w-full flex flex-col items-start justify-start'>
            <SwitchGenTypes options={options} onTabChange={(option: Option) => { setSelectedOption(option) }} />
        </div>
        {selectedOption.page}
    </div>
}