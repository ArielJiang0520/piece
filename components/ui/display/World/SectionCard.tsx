'use client'
import { useState } from "react";
import { PlusCircleIcon, MinusIcon } from "@/components/icon/icon";
import type { WorldDescriptionSectionCard } from "@/types/types";
import PopupDialog from "@/components/ui/input/PopupDialog";
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
        return <div className='flex flex-col w-full space-y-4'>
            <ImagesDisplayRow bucket="world" paths={cardImages} dimension={{ height: "h-64", width: "w-64" }} />
            <div className='text-center font-serif text-2xl font-semibold'>
                {cardTitle}
            </div>
            <div className='w-full border-b h-px my-2'></div>
            <div className='text-sm min-h-[300px] whitespace-pre-line'>
                {cardContent}
            </div>
        </div>
    }

    return (
        <div
            id='card'
            className={`relative p-8 flex flex-col justify-start items-center space-y-2 border rounded-lg h-full ${display ? 'cursor-pointer' : ''}`}
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


            <div id='image-display' className="flex flex-row justify-start items-start space-x-2 overflow-hidden">
                <ImagesDisplayRow bucket="world" paths={cardImages} dimension={{ height: "h-64", width: "w-64" }} />
            </div>

            <div className='text-center leading-snug text-2xl overflow-hidden overflow-ellipsis whitespace-nowrap w-full'>
                {cardTitle}
            </div>

            <div className='w-full border-b h-px'></div>

            <div className='text-sm text-left overflow-hidden overflow-ellipsis w-full whitespace-pre-line max-h-[200px]'>
                {cardContent}
            </div>


            <PopupDialog
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

interface AddCardProps {
    text: string;
    onclick: () => void,
}

export const AddSectionCard = ({ text, onclick }: AddCardProps) => {
    return (
        <div className={`p-8 flex flex-col justify-center items-center space-y-2 border cursor-pointer rounded-lg h-full min-h-[300px]`}
            onClick={onclick}>
            <div>
                <PlusCircleIcon
                    size={40}
                    className='text-foreground/20'
                />
            </div>
            <div className='font-mono text-sm text-foreground/20'>
                {text}
            </div>
        </div>
    )
}