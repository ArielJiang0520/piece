'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/app/NavBar';
import { useDraftContext } from './draft-provider';
import InputList from '@/components/ui/input/InputBox';
import { formatTimestamp } from '@/utils/helpers';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import { InputDialog } from '@/components/ui/input/InputDialog';
import { LoadingOverlay } from '@/components/ui/widget/loading'; //TODO: Loading Overlay has bugs
import { BsFillTrashFill } from 'react-icons/bs'

const defaultOption = { id: 'default', name: 'A New Draft' };

export default function LocalNavBar() {
    const PageTitleNavBarComponent = () => {
        const { currentDraft } = useDraftContext();
        return (
            <NavBarHeader title="Create-a-World" subtitle={currentDraft ? `Editing draft: ${currentDraft.world_name}` : `Editing a new world`} />
        )
    }
    const LocalNavBarComponent = () => {
        const router = useRouter()
        const { handleDraftChange, handleDraftDelete, drafts, updateDrafts } = useDraftContext();
        const allData = [defaultOption, ...drafts]
        const [selected, setSelected] = useState<any>(allData[0]);
        const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
        const [isLoading, setIsLoading] = useState(false)

        useEffect(() => {
            handleDraftChange(selected)
        }, [selected])

        const onDraftDelete = () => {
            setDeleteDialogOpen(true)
        }

        return (
            <div id="draft-group" className='px-4 w-full font-mono flex flex-row justify-start items-center space-x-2'>
                <FieldTitleDisplay label={'load draft'} textSize={'text-xs'} />
                <InputList
                    data={allData}
                    width='w-56'
                    nameKey="world_name"
                    selected={selected}
                    setSelected={setSelected}
                    display_func={(item: any) => item.id === "default" ? `${item.name}` : `${formatTimestamp(item.modified_at)} - ${item.world_name}`}

                />
                {selected.id !== "default" ? <BsFillTrashFill className='cursor-pointer flex-shrink-0 flex-grow-0' onClick={onDraftDelete} /> : null}
                <InputDialog
                    isOpen={isDeleteDialogOpen}
                    setIsOpen={setDeleteDialogOpen}
                    dialogTitle={`Delete Draft`}
                    dialogContent={`Are you sure you want to delete draft "${selected.world_name}"?`}
                    initInputValue={selected}
                    confirmAction={() => {
                        setIsLoading(true)
                        handleDraftDelete(selected);
                        updateDrafts();
                        setIsLoading(false)
                        router.refresh();
                    }}
                    dialogType='confirm'
                />
                {isLoading && <LoadingOverlay />}
            </div>
        );
    }

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}