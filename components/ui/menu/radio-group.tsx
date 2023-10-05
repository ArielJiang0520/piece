import { RadioGroup } from '@headlessui/react';
import { useState } from 'react';

export type Option = {
    id: number;
    name: string;
    icon: React.ReactNode;
    page: React.ReactNode;
};

interface SwitchGroupsTypes {
    options: Option[];
    onTabChange: (option: Option) => void;
}

export default function SwitchGroups({ options, onTabChange }: SwitchGroupsTypes) {
    const [selectedOption, setSelectedOption] = useState<Option>(options[0]);

    const handleTabChange = (option: Option) => {
        setSelectedOption(option)
        onTabChange(option)
    }

    return (

        <RadioGroup value={selectedOption} onChange={handleTabChange}>
            <RadioGroup.Label className="sr-only">Choose an option</RadioGroup.Label>
            <div className="flex flex-row space-x-4">
                {options.map((option: Option) => (
                    <RadioGroup.Option key={option.id} value={option}
                        className={`cursor-pointer flex flex-row items-center justify-center rounded-lg p-5 space-x-2  border 
                            ${selectedOption.id === option.id ? "bg-brand text-white border-brand" : "text-foreground/50"} `}
                    >
                        {option.icon}
                        <span className={`text-sm font-semibold whitespace-nowrap`}>
                            {option.name}
                        </span>

                    </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>

    )
}