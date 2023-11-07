'use client'
import { World } from "@/types/types";
import PromptGen from "./PromptGen";
import { PencilIcon, SingleUserIcon } from '@/components/icon/icon';
import { useEffect, useState } from "react";
import Roleplay from "./Roleplay";
import { usePathname, useSearchParams } from "next/navigation";
import { DraftProvider } from '@/app/create-a-piece/draft-provider';
import Simulation from "./Simulation";
import { RadioGroup } from '@headlessui/react';
import Link from "next/link";

type Option = {
    id: string;
    name: string;
    icon: React.ReactNode;
    page: React.ReactNode;
    link: string;
};

export default function ExploreWorld({ world, models }: { world: World, models: any[] }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const options: Option[] = [
        { id: 'prompt-gen', name: "Write Stories", icon: <PencilIcon />, page: <PromptGen world={world} models={models} />, link: `${pathname}?gen_type=prompt-gen` },
        { id: 'roleplay', name: "Roleplay", icon: <SingleUserIcon />, page: <Roleplay world={world} />, link: `${pathname}?gen_type=roleplay` },
        { id: 'simulation', name: "Simulation", icon: <SingleUserIcon />, page: <Simulation world={world} />, link: `${pathname}?gen_type=simulation` },
    ];

    const [selectedOption, setSelectedOption] = useState(options[0])

    useEffect(() => {
        const gen_type = searchParams.get('gen_type');
        if (!gen_type)
            setSelectedOption(options[0]);
        else {
            setSelectedOption(options.find(op => op.id === gen_type)!)
        }
    }, [searchParams])

    return <DraftProvider>
        <div className="w-full flex flex-col space-y-6 items-start">
            <div className="w-full flex flex-col overflow-x-auto md:items-center md:justify-center">
                <RadioGroup value={selectedOption} onChange={setSelectedOption}>
                    <RadioGroup.Label className="sr-only">Choose an option</RadioGroup.Label>
                    <div className="flex flex-row space-x-4">
                        {options.map((option: Option) => (
                            <Link key={option.link} href={option.link}>
                                <RadioGroup.Option key={option.id} value={option}
                                    className={`cursor-pointer flex flex-row items-center justify-center rounded-lg p-5 space-x-2  border 
                            ${selectedOption.id === option.id ? "bg-brand text-white border-brand" : "text-foreground/50"} `}
                                >
                                    {option.icon}
                                    <span className={`text-sm font-semibold whitespace-nowrap`}>
                                        {option.name}
                                    </span>
                                </RadioGroup.Option>
                            </Link>
                        ))}
                    </div>
                </RadioGroup>
            </div>
            {selectedOption.page}
        </div>
    </DraftProvider>
}