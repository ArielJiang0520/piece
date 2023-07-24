'use client'
import NavBar from '@/components/ui/navbar/NavBar';
import { useDraftContext } from './draft-provider';
import InputList from '@/components/ui/input/InputBox';
import { formatTimestamp } from '@/utils/helpers';
import { FieldTitleDisplay } from '@/components/ui/display/displays';
import { NavBarHeader } from '@/components/ui/display/displays';
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
        const { handleDraftChange, drafts } = useDraftContext();

        return (
            <div id="draft-group" className='w-full flex flex-row justify-start items-center space-x-2'>
                <FieldTitleDisplay label={'load draft'} textSize={'text-xs'} />
                <InputList
                    data={[defaultOption, ...drafts]}
                    width='w-56'
                    nameKey="world_name"
                    display_func={(item: any) => item.id === "default" ? `${item.name}` : `${formatTimestamp(item.modified_at)} - ${item.world_name}`}
                    handleOnChange={(selectedOption) => handleDraftChange(selectedOption)}
                />
                < BsFillTrashFill className='cursor-pointer' />
            </div>
        );
    }

    return <NavBar
        PageTitleNavBarComponent={PageTitleNavBarComponent}
        LocalNavBarComponent={LocalNavBarComponent}
    />
}