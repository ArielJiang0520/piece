'use client'
import { useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { ResetIcon, UpDownIcon, CheckIcon } from '@/components/icon/icon'

interface SearchBarProps {
    candidates: any[],
    nameKey: string,
    placeholder: string,
    onSelect: (arg: any) => void;
    display_func?: ((arg?: any) => any) | null;
}
export default function SearchBar({ candidates, nameKey, placeholder, onSelect, display_func = null }: SearchBarProps) {
    const [selectedItem, setSelectedItem] = useState<null | any>(null)
    const [query, setQuery] = useState('')

    useEffect(() => {
        if (selectedItem) {
            onSelect(selectedItem);
        }
    }, [selectedItem])

    // filter either by first letters or whole words
    const filteredItems =
        query === ''
            ? candidates
            : candidates.filter((item) => {
                const lowerName = item[nameKey].toLowerCase();
                const lowerQuery = query.toLowerCase();
                if (lowerName.startsWith(lowerQuery)) {
                    return true;
                }

                const nameSegments = lowerName.split(' ');
                return nameSegments.some((segment: string) => segment.startsWith(lowerQuery));
            });

    return (
        <Combobox value={selectedItem} onChange={setSelectedItem} nullable>
            <div className='flex flex-row justify-start items-center space-x-3 w-full'>

                <div className='relative text-sm flex-grow'>
                    <div className='relative cursor-default overflow-hidden'>
                        <Combobox.Input className={`border rounded-2xl py-2 px-3 focus:outline-none w-full`}
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(item: any) => item ? item[nameKey] : null}
                            placeholder={placeholder}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <UpDownIcon
                                className="h-5 w-5 text-foreground/50"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>

                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        {filteredItems.length === 0 && query !== '' ? (
                            <div className={`absolute bg-background border shadow-md overflow-auto rounded-2xl py-2 focus:outline-none w-full`}>
                                <div className='px-3 py-2 flex flex-row justify-between items-center'>
                                    Nothing found.
                                </div>
                            </div>
                        ) :
                            <Combobox.Options className={`absolute bg-background border shadow-md overflow-auto rounded-2xl py-2 focus:outline-none w-full z-20`}>
                                {filteredItems.map((item) => (
                                    <Combobox.Option
                                        key={item.id}
                                        value={item}
                                        className="ui-active:bg-foreground/20 ui-active:text-foreground ui-not-active:bg-background ui-not-active:text-foreground"
                                    >
                                        <div className='px-3 py-2 flex flex-row justify-between items-center'>
                                            <div className='overflow-hidden whitespace-nowrap overflow-ellipsis flex-1'>
                                                {display_func ? display_func(item) : item[nameKey]}
                                            </div>
                                            <CheckIcon className={`${item.id === selectedItem?.id ? "block" : "hidden"} w-3 h-3 mx-2 flex-shrink-0`} />
                                        </div>
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>}
                    </Transition>
                </div>
                <ResetIcon className='text-foreground/50 cursor-pointer' onClick={() => setSelectedItem(null)} />
            </div>
        </Combobox>
    )
}