'use client'

import InputList from '@/components/ui/input/InputBox';
import { formatTimestamp } from '@/utils/helpers';
import { FieldTitleDisplay } from '@/components/ui/display/displays';

interface SelectDraftProps {
    data: any[],
    onDraftChange: (arg: any) => void
}
export function SelectDraft({ data, onDraftChange }: SelectDraftProps) {
    return (
        <div id="draft-group" className='w-full flex flex-row justify-start items-center space-x-2'>
            <FieldTitleDisplay label={'load draft'} textSize={'text-xs'} />
            <InputList
                data={data}
                width='w-48'
                nameKey="world_name"
                display_func={(item: any) => item.id === "default" ? `${item.name}` : `${formatTimestamp(item.modified_at)} - ${item.world_name}`}
                handleOnChange={(selectedOption) => onDraftChange(selectedOption)}
            />
        </div>
    );
};

