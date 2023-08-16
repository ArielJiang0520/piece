'use client'
// import MyRadioGroup, { SolidSwitchTab } from '@/components/ui/switch-tab/switch-tab'
import TextInput from '@/components/ui/input/InputTextField'
import { useFormikContext } from 'formik';
import { RadioGroup } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { CheckIcon } from '@/components/icon/icon'
import { WorldPayload } from '@/types/types.world';

interface OriginSwitchTabProps {

}

type Option = {
    id: number;
    name: string;
};

export default function OriginSwitchTab({ }: OriginSwitchTabProps) {
    const { setFieldValue, values } = useFormikContext<WorldPayload>();
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        if (selectedOptionId === 1) {
            setFieldValue('origin', null);
            setInputValue('')
        }
    }, [selectedOptionId, setFieldValue]);

    useEffect(() => {
        if (values.origin === null) {
            setSelectedOptionId(1)
        } else {
            setSelectedOptionId(2)
        }
        setInputValue(values.origin ? values.origin : '');
    }, [values.origin]);



    const options: Option[] = [
        { id: 1, name: 'Original Work' },
        { id: 2, name: 'Fandom Derived' },
    ];

    return (
        <div className="w-full max-w-2xl ">
            <RadioGroup value={selectedOptionId} onChange={setSelectedOptionId}>
                <RadioGroup.Label className="sr-only">Choose an option</RadioGroup.Label>
                <div className="space-y-0">
                    {options.map((option) => (
                        <RadioGroup.Option key={option.id} value={option.id} className={`relative flex flex-col rounded-lg px-3 py-2 cursor-pointer
                        ${selectedOptionId === option.id ? "text-foreground bg-foreground/10" : "text-foreground/50 "}`}>
                            <div className='flex flex-row items-center justify-between space-x-2' >
                                <span className={`block text-sm font-serif font-semibold  `}>
                                    {option.name}
                                </span>
                                {option.id === selectedOptionId && <CheckIcon className='w-5 h-5' />}
                            </div>
                            {option.id === selectedOptionId && selectedOptionId === 2 && (
                                <TextInput name={"origin"} placeholder={"Add your fandom..."} textSize={"text-base"} multiline={1} />
                            )}
                        </RadioGroup.Option>
                    ))}
                </div>
            </RadioGroup>
        </div>
    );
};
