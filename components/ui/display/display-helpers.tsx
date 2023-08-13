import React from 'react';

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
    bold: string,
    truncate?: number
}

export const FieldContentDisplay: React.FC<FieldContentDisplayProps> = ({ content, textSize, bold, truncate = -1 }) => {
    return (
        <div>
            <p className={`font-serif ${textSize} ${bold}`}>{truncate != -1 ? content.length > truncate ? `${content.slice(0, truncate)}...` : content : content}</p>
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