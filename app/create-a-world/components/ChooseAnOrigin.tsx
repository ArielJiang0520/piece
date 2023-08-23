'use client'
import { useFormikContext } from 'formik';
import { RadioGroup } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { CheckIcon } from '@/components/icon/icon'
import { Fandom, EmptyFandom, WorldPayload } from '@/types/types';
import SearchBar from '@/components/ui/input/SearchBar';
import { IconButtonSmall } from '@/components/ui/button/button-helpers';
import { PlusIcon } from '@/components/icon/icon';
import PopupDialog from '@/components/ui/input/PopupDialog';
import { fetch_all_fandoms, insert_fandom } from '@/utils/data-helpers';

const CreateFandomButton = ({ }: {}) => {
    const [isCreateFandomOpen, setIsCreateFandomOpen] = useState(false)

    return <>
        <div onClick={() => setIsCreateFandomOpen(true)}>
            <IconButtonSmall title={"Add New"} icon={<PlusIcon />} />
        </div>
        <PopupDialog
            dialogType='add-fandom'
            isOpen={isCreateFandomOpen}
            setIsOpen={setIsCreateFandomOpen}
            dialogTitle='Create a new fandom'
            dialogContent=''
            initInputValue={EmptyFandom}
            confirmAction={async (values: Fandom) => { await insert_fandom(values) }}
        />
    </>
}

type Option = {
    id: number;
    name: string;
};

export default function ChooseAnOrigin({ }: {}) {
    const { setFieldValue, values } = useFormikContext<WorldPayload>();
    const [fandoms, setFandoms] = useState<Fandom[]>([])
    const [selectedOptionId, setSelectedOptionId] = useState<number>(values.origin === null ? 1 : 2);
    const [selectedFandom, setSelectedFandom] = useState<string | null>(values.origin)

    useEffect(() => {
        const fetchFandoms = async () => setFandoms(await fetch_all_fandoms());
        fetchFandoms()
    }, [])

    useEffect(() => {
        if (selectedOptionId === 1) {
            setFieldValue('origin', null);
        }
    }, [selectedOptionId]);


    useEffect(() => {
        setFieldValue('origin', selectedFandom)
    }, [selectedFandom])

    const options: Option[] = [
        { id: 1, name: 'Original World' },
        { id: 2, name: 'Fandom Derived' },
    ];

    return (
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
                            <div className='flex flex-col mt-2 space-y-2'>
                                <SearchBar
                                    candidates={fandoms}
                                    nameKey="name"
                                    placeholder="Choose your fandom"
                                    onSelect={(item: Fandom) => { setSelectedFandom(item.id) }}
                                    display_func={(item: Fandom) => `${item.name} (${item.num_of_worlds})`}
                                    defaultSelectedId={values.origin}
                                />
                                <div className='flex flex-row items-center justify-end space-x-2 '>
                                    <div className='italic text-xs'>
                                        Didn't see your fandom?
                                    </div>
                                    <CreateFandomButton />
                                </div>
                            </div>
                        )}

                    </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>
    );
};
