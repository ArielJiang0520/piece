'use client'
import { useFormikContext } from 'formik';
import { RadioGroup } from '@headlessui/react';
import { useState, useEffect, use } from 'react';
import { CheckIcon } from '@/components/icon/icon'
import { Fandom, EmptyFandom, WorldPayload } from '@/types/types.world';
import SearchBar from '@/components/ui/input/SearchBar';
import { IconButtonSmall } from '@/components/ui/button/button-helpers';
import { PlusIcon } from '@/components/icon/icon';
import PopupDialog from '@/components/ui/input/PopupDialog';
import { addNewFandom, listAllFandoms } from '@/utils/fandom-helpers';

const CreateFandomButton = ({ fetchFandoms }: { fetchFandoms: () => void; }) => {
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
            confirmAction={async (values) => { addNewFandom(values); fetchFandoms() }}
        />
    </>
}

type Option = {
    id: number;
    name: string;
};

export default function ChooseAnOrigin({ }: {}) {
    const { setFieldValue, values } = useFormikContext<WorldPayload>();
    const [selectedOptionId, setSelectedOptionId] = useState<number>(values.origin === null ? 1 : 2);
    const [selectedFandom, setSelectedFandom] = useState<string | null>(values.origin)
    const [fandoms, setFandoms] = useState<Fandom[]>([])

    useEffect(() => {
        if (selectedOptionId === 1) {
            setFieldValue('origin', null);
        }
    }, [selectedOptionId]);

    useEffect(() => {
        setFieldValue('origin', selectedFandom)
    }, [selectedFandom])



    const fetchFandoms = async () => {
        setFandoms(await listAllFandoms())
    }

    useEffect(() => {
        fetchFandoms()
    }, [fandoms])


    const options: Option[] = [
        { id: 1, name: 'Original World' },
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
                                <div className='flex flex-col mt-2 space-y-2'>
                                    <SearchBar

                                        candidates={fandoms}
                                        nameKey="name"
                                        placeholder="Choose your fandom"
                                        onSelect={(fandom: Fandom) => { setSelectedFandom(fandom.id) }}
                                    />
                                    <div className='flex flex-row items-center justify-end space-x-2 '>
                                        <div className='italic text-xs'>
                                            Didn't see your fandom?
                                        </div>
                                        <CreateFandomButton fetchFandoms={fetchFandoms} />
                                    </div>
                                </div>
                            )}
                        </RadioGroup.Option>
                    ))}
                </div>
            </RadioGroup>

        </div>
    );
};
