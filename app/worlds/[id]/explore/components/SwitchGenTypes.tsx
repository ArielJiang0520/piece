import { RadioGroup } from '@headlessui/react';
import { useState, Fragment } from 'react';


export type Option = {
    id: number;
    name: string;
    icon: React.ReactNode;
    page: React.ReactNode;
};


interface SwitchGenTypes {
    options: Option[];
    onTabChange: (option: Option) => void;
}

export default function SwitchGenTypes({ options, onTabChange }: SwitchGenTypes) {
    const [selectedOption, setSelectedOption] = useState<Option>(options[0]);

    const handleTabChange = (option: Option) => {
        setSelectedOption(option)
        onTabChange(option)
    }

    return (
        <div className="w-full  flex justify-center">
            <RadioGroup value={selectedOption} onChange={handleTabChange}>
                <RadioGroup.Label className="sr-only">Choose an option</RadioGroup.Label>
                <div className="grid grid-cols-2 lg:grid-rows-1 gap-2">
                    {options.map((option: Option) => (
                        <RadioGroup.Option key={option.id} value={option}
                            className={`cursor-pointer  relative flex flex-row items-center justify-center rounded-lg p-5 space-x-2  border 
                                ${selectedOption.id === option.id ? "bg-brand text-white border-brand" : "text-foreground/50"} `}
                        >

                            {option.icon}
                            <span className={`block text-sm font-semibold`}>
                                {option.name}
                            </span>

                        </RadioGroup.Option>
                    ))}
                </div>
            </RadioGroup>
        </div>
    )
}