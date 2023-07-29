import React from 'react';
import { formatTimestamp } from '@/utils/helpers';
import { WorldDescriptionSectionCard } from "@/types/types.world";
import { CalendarIcon, BookIcon, SingleUserIcon, Rating18PlusIcon, RatingGeneralIcon } from '@/components/icon/icon';

interface InputTitleProps {
    label: string,
    textSize?: string
};

export const FieldTitleDisplay: React.FC<InputTitleProps> = ({ label, textSize = "text-base" }) => {
    return (
        <div>
            <label className={`${textSize} mb-2 text-foreground/50 font-bold whitespace-nowrap`}>
                {label.toLocaleUpperCase()}
            </label>
        </div>
    )
}

interface FieldContentDisplayProps {
    content: string,
    textSize: string,
    bold: string
}

export const FieldContentDisplay: React.FC<FieldContentDisplayProps> = ({ content, textSize, bold }) => {
    return (
        <div>
            <p className={`py-2 w-full font-serif ${textSize} ${bold}`}>{content}</p>
        </div>
    )
}


export const MetadataDisplay = ({ items }: { items: any[] }) => {
    return (
        <div className='w-full border-t border-b grid md:grid-cols-2 sm:grid-cols-1 justify-items-start py-3 px-2 text-right text-sm text-foreground/80'>
            <div className="mb-1">
                <div className='flex flex-row justify-start items-center space-x-2'>
                    <CalendarIcon />
                    <span>Created on {formatTimestamp(items[0], true)}</span>
                </div>
            </div>
            <div className="mb-1 md:col-start-auto sm:col-start-auto">
                <div className='flex flex-row justify-start items-center space-x-2'>
                    <BookIcon />
                    <span>{items[1] ? `Derived from "${items[1]}"` : "Original World"}</span>
                </div>
            </div>
            <div className="md:col-start-auto sm:col-start-auto mb-1 md:mb-0">
                <div className='flex flex-row justify-start items-center space-x-2'>
                    {items[2] ? <Rating18PlusIcon /> : <RatingGeneralIcon />}
                    <span>{items[2] ? "18+ Audiences" : "General Audiences"}</span>
                </div>
            </div>
            <div className="md:col-start-auto sm:col-start-auto">
                <div className='flex flex-row justify-start items-center space-x-2'>
                    <SingleUserIcon />
                    <span>{"Single World-Creator"}</span>
                </div>
            </div>
        </div>
    )
}



export const CreatorDisplay = ({ items }: { items: any[] }) => {
    return (
        <div className='w-full border-t border-b grid grid-cols-2 justify-items-start py-5 px-2'>
            {items.map(item =>
                <div className="text-right text-sm">
                    {item}
                </div>)}
        </div>
    )
}