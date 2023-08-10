'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/app/NavBar';
import { useDraftContext, } from './draft-provider';
import type { World, DefaultWorld } from '@/types/types.world';
import DropDownSelector from '@/components/ui/input/DropDownSelector';
import { formatTimestamp } from '@/utils/helpers';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import { InputDialog } from '@/components/ui/input/PopupDialog';
import { LoadingOverlay } from '@/components/ui/widget/loading'; //TODO: Loading Overlay has bugs
import { TrashIcon } from '@/components/icon/icon';
import { useSearchParams } from 'next/navigation';

export default function LocalNavBar() {
    const searchParams = useSearchParams()
    const edit_id = searchParams.get("edit_id")

    console.log(searchParams, edit_id)

    const PageTitleNavBarComponent = () => {
        const { currentDraft } = useDraftContext();
        return <NavBarHeader title="Create-a-World" subtitle={edit_id ? `Editing an existing world` : (currentDraft ? `Editing draft: ${currentDraft.world_name}` : `Editing a new world`)} />
    }

    const LocalNavBarComponent = () => {
        if (edit_id) {
            return <></>
        }
        const router = useRouter()

        const { handleDraftChange, handleDraftDelete, drafts, fetchDrafts } = useDraftContext();

        const [selected, setSelected] = useState<World | DefaultWorld>(drafts[0]);

        const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
        const [isLoading, setIsLoading] = useState(false)

        useEffect(() => {
            handleDraftChange(selected)
        }, [selected])

        const onDraftDelete = () => {
            setDeleteDialogOpen(true)
        }

        const confirmAction = async () => {
            setIsLoading(true);
            await handleDraftDelete(selected);
            await fetchDrafts();
            setIsLoading(false);
            router.refresh();
        };

        return (
            <div id="draft-group" className='px-4 w-full font-mono flex flex-row justify-start items-center space-x-2'>
                <FieldTitleDisplay label={'load draft'} textSize={'text-xs'} />
                <DropDownSelector
                    data={drafts}
                    width='w-56'
                    nameKey="world_name"
                    selected={selected}
                    setSelected={setSelected}
                    display_func={(item: any) => item.default ? `${item.world_name}` : `${formatTimestamp(item.modified_at)} - ${item.world_name}`}
                />
                {'default' in selected ? null : <TrashIcon className='cursor-pointer flex-shrink-0 flex-grow-0' onClick={onDraftDelete} />}
                <InputDialog
                    isOpen={isDeleteDialogOpen}
                    setIsOpen={setDeleteDialogOpen}
                    dialogTitle={`Delete Draft`}
                    dialogContent={`Are you sure you want to delete draft "${selected.world_name}"?`}
                    initInputValue={selected}
                    confirmAction={confirmAction}
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