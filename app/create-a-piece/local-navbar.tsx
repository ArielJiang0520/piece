'use client'
import { NavBarHeader } from '@/components/ui/navbar/navbar-helpers';
import NavBar from '@/app/NavBar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DefaultPiece, Piece, World } from '@/types/types';
import { useDraftContext } from './draft-provider';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import DropDownSelector from '@/components/ui/input/DropDownSelector';
import PopupDialog from '@/components/ui/input/PopupDialog';
import { formatTimestamp } from '@/utils/helpers';
import { LoadingOverlay } from '@/components/ui/widget/loading';
import { TrashIcon } from '@/components/icon/icon';
import PeekWorld from '@/components/ui/display/World/PeekWorld';
import { useSearchParams } from 'next/navigation';

export default function LocalNavBar({ world }: { world: World }) {
    const searchParams = useSearchParams()
    const edit_id = searchParams.get("edit_id")

    const PageTitleNavBarComponent = () => {
        return (
            <NavBarHeader title={"create-a-piece"} subtitle={edit_id ? `Editing: ${edit_id}` : world!.name} icon={<PeekWorld world={world!} iconOnly={true} />} />
        )
    }

    const LocalNavBarComponent = edit_id ? null : () => {
        const router = useRouter()
        const { handleDraftChange, handleDraftDelete, drafts } = useDraftContext();
        const [selected, setSelected] = useState<Piece | DefaultPiece>(drafts[0]);
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
                    display_func={(piece: Piece | DefaultPiece) =>
                        'default' in piece ?
                            `${piece.name}` :
                            `${formatTimestamp(piece.draft_modified_at ?
                                piece.draft_modified_at :
                                piece.draft_created_at)} - ${piece.name}`}
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