'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/app/NavBar';
import { useDraftContext, } from './draft-provider';
import type { World, DefaultWorld } from '@/types/types';
import DropDownSelector from '@/components/ui/input/DropDownSelector';
import { formatTimestamp } from '@/utils/helpers';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import PopupDialog from '@/components/ui/input/PopupDialog';
import { LoadingOverlay } from '@/components/ui/widget/loading'; //TODO: Loading Overlay has bugs
import { TrashIcon } from '@/components/icon/icon';
import { useSearchParams } from 'next/navigation';

export default function LocalNavBar() {
    const searchParams = useSearchParams()
    const edit_id = searchParams.get("edit_id")

    const PageTitleNavBarComponent = () => {
        const { currentDraft } = useDraftContext();
        return <NavBarHeader title="Create-a-World" subtitle={edit_id ? `Editing ${currentDraft.name}` : (currentDraft ? `Editing draft: ${currentDraft.name}` : `Editing a new world`)} />
    }

    const LocalNavBarComponent = edit_id ? null : () => {
        const router = useRouter()
        const { handleDraftChange, handleDraftDelete, drafts } = useDraftContext();
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
            setIsLoading(false);
            router.refresh();
        };

        return (
            <div id="draft-group" className='px-4 w-full font-mono flex flex-row justify-start items-center space-x-2'>
                <FieldTitleDisplay label={'load draft'} textSize={'text-xs'} />
                <DropDownSelector
                    data={drafts}
                    width='w-56'
                    nameKey="name"
                    selected={selected}
                    setSelected={setSelected}
                    display_func={(item: World | DefaultWorld) =>
                        'default' in item ?
                            `${item.name}` :
                            `${formatTimestamp(item.draft_modified_at ?
                                item.draft_modified_at :
                                item.draft_created_at)} - ${item.name}`}
                />
                {'default' in selected ? null : <TrashIcon className='cursor-pointer flex-shrink-0 flex-grow-0' onClick={onDraftDelete} />}
                <PopupDialog
                    isOpen={isDeleteDialogOpen}
                    setIsOpen={setDeleteDialogOpen}
                    dialogTitle={`Delete Draft`}
                    dialogContent={`Are you sure you want to delete draft "${selected.name}"?`}
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