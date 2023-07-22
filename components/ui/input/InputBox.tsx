'use client'
import { useState } from 'react'
import { Listbox } from '@headlessui/react'
import { ChevronRightIcon, CheckIcon } from '@heroicons/react/20/solid'

interface InputListProps {
    data: any[],
    width: string,
    nameKey: string,
    display_func?: ((arg?: any) => any) | null,
    handleOnChange?: ((arg: any) => void) | null
}

export default function InputList({ data, width, nameKey, display_func = null, handleOnChange = null }: InputListProps) {
    const defaultOption = { id: 'default', name: 'A New Draft' };
    const allData = [defaultOption, ...data];
    const [selected, setSelected] = useState<any>(allData[0]);

    const handleChange = (item: any) => {
        setSelected(item);
        if (handleOnChange)
            handleOnChange(item);
    };

    return (
        <Listbox value={selected} onChange={handleChange}>
            <div className='relative'>
                <Listbox.Button className={`my-2 border rounded-2xl text-xs py-2 px-3 focus:outline-none ${width}`}>
                    <div className='flex flex-row justify-between items-center' >
                        <div className='overflow-hidden whitespace-nowrap overflow-ellipsis'>
                            {display_func ? display_func(selected) : selected[nameKey]}
                        </div>
                        <ChevronRightIcon className={`ui-open:transform ui-open:rotate-90 w-5 h-5 mx-2`} />
                    </div>
                </Listbox.Button>
                <Listbox.Options className={`absolute bg-background border shadow-md text-xs overflow-auto rounded-2xl py-2 focus:outline-none ${width}`}>
                    {allData.map((item) => (
                        <Listbox.Option
                            key={item.id}
                            value={item}
                            className="ui-active:bg-foreground/20 ui-active:text-foreground ui-not-active:bg-background ui-not-active:text-foreground"
                        >
                            <div className='px-3 py-2 flex flex-row justify-between items-center'>
                                <div className='overflow-hidden whitespace-nowrap overflow-ellipsis flex-1'>
                                    {display_func ? display_func(item) : item[nameKey]}
                                </div>
                                <CheckIcon className={`${item.id === selected.id ? "block" : "hidden"} w-3 h-3 mx-2 flex-shrink-0`} />
                            </div>
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </Listbox>
    )
}

