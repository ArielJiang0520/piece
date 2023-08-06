'use client'
import { useState } from "react";
import { PlusCircleIcon, MinusIcon } from "@/components/icon/icon";
import type { WorldDescriptionSectionCard } from "@/types/types.world";
import { InputDialog } from "@/components/ui/input/InputDialog";
import { ImagesDisplayRow } from "@/components/ui/image/ImagesDisplayRow";

interface SectionCardProps {
    index: number,
    card: WorldDescriptionSectionCard,
    onclick: (arg: number) => void,
    ondel: (arg: number) => void,
    display?: boolean
}
export const SectionCard = ({ index, card, onclick, ondel, display = false }: SectionCardProps) => {
    const { cardTitle, cardContent, cardImages } = card
    const [isOpen, setIsOpen] = useState(false)

    function DisplayCard() {
        return <div className='flex flex-col w-full space-y-2'>
            <div className='text-center font-serif text-2xl font-semibold'>
                {cardTitle}
            </div>
            <div className='w-full border-b-2 h-px my-2'></div>
            <div className='text-sm min-h-[300px] whitespace-pre-line'>
                {cardContent}
            </div>
            <ImagesDisplayRow paths={cardImages.slice(0, 3)} dimension={{ height: "h-48", width: "w-48" }} />
        </div>
    }

    return (
        <div
            id='card'
            className={`relative flex-shrink-0 p-8 flex flex-col justify-start items-center space-y-2 border-2 rounded-lg w-64 ${display ? 'cursor-pointer' : ''}`}
            onClick={display ? () => { setIsOpen(true) } : () => onclick(index)}
        >
            {display ? null : <div>
                <MinusIcon
                    className='absolute top-2 right-2 w-5 h-5 text-foreground/20'
                    onClick={(event) => {
                        event.stopPropagation();
                        ondel(index)
                    }}
                />
            </div>}

            <div className='text-center leading-snug text-2xl overflow-hidden overflow-ellipsis whitespace-nowrap w-full h-12'>
                {cardTitle}
            </div>

            <div className='w-full border-b-2 h-px'></div>

            <div className='text-xs text-left overflow-hidden overflow-ellipsis h-44 w-full whitespace-pre-line'>
                {cardContent}
            </div>

            <div id='image-display' className="flex flex-row justify-start items-start space-x-2 overflow-hidden">
                <ImagesDisplayRow paths={cardImages.slice(0, 3)} dimension={{ height: "h-24", width: "w-24" }} />
            </div>
            <InputDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                dialogTitle=''
                dialogContent=''
                initInputValue={<DisplayCard />}
                confirmAction={() => setIsOpen(false)}
                dialogType='display'
                overwriteConfirm='Close'
                hideCancel={true}
            />
        </div>
    )
}


export const NewSectionCard = ({ onclick }: { onclick: () => void }) => {
    return (
        <div className='flex-shrink-0 flex flex-col justify-center items-center space-y-2 border-2 cursor-pointer rounded-lg w-64'
            onClick={onclick}>
            <div>
                <PlusCircleIcon
                    size={40}
                    className='text-foreground/20'
                />
            </div>
            <div className='font-mono text-sm text-foreground/20'>
                Add New Card
            </div>
        </div>
    )
}