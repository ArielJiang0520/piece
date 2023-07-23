import React from 'react';

import { WorldDescriptionSection, WorldDescriptionSectionCard } from "@/types/types.world";
import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid'

interface InputTitleProps {
    label: string,
    textSize?: string
};

export const FieldTitleDisplay: React.FC<InputTitleProps> = ({ label, textSize = "text-base" }) => {
    return (
        <div>
            <label className={`${textSize} mb-2 text-foreground/50 font-bold`}>
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


interface AccordionDisplayProps {
    sections: WorldDescriptionSection[]
}

export const AccordionDisplay: React.FC<AccordionDisplayProps> = ({ sections }) => {
    return (
        <div className='flex flex-col justify-start'>
            <ul className='my-5 font-serif space-y-2'>
                {sections.map((section) => (
                    <li className="">
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <div id="accordion-panel" className="flex flex-row justify-between items-center w-full ">
                                        <div className='flex flex-row items-center space-x-2'>
                                            <div
                                                className="font-bold text-xl md:text-3xl overflow-hidden max-w-xs md:max-w-lg whitespace-nowrap overflow-ellipsis"
                                            >
                                                {section.sectionTitle}
                                            </div>

                                            <Disclosure.Button>
                                                <ChevronRightIcon className={`${open ? 'transform rotate-90' : ''} w-5 h-5`} />
                                            </Disclosure.Button>
                                        </div>
                                    </div>
                                    <Disclosure.Panel className="flex flex-row w-full space-x-5 justify-start p-10 overflow-x-auto">
                                        {section.sectionCards.map((card, index) =>
                                            <SectionCard
                                                key={index}
                                                title={card.cardTitle}
                                                content={card.cardContent}
                                            />
                                        )}
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                    </li>
                ))}
            </ul>
        </div>
    )
}



export const SectionCard = ({ title, content }: { title: string, content: string }) => {
    return (
        <div id='card'
            className='relative flex-shrink-0 p-8 flex flex-col justify-start items-center space-y-2 border-2 cursor-pointer rounded-lg w-64 h-64'
        >
            <div className='text-center leading-snug text-2xl overflow-hidden overflow-ellipsis whitespace-nowrap w-full h-12'>
                {title}
            </div>
            <div className='w-full border-b-2 h-px'></div>
            <div className='text-xs text-left overflow-hidden overflow-ellipsis h-48 w-full'>
                {content}
            </div>
        </div>
    )
}

export const NavBarHeader = ({ title, subtitle }: { title: string, subtitle: string }) => {
    return (
        <div className='flex flex-col font-mono text-foreground justify-center pt-2 items-start'>
            <h1 className='font-bold text-xs '>
                {title}
            </h1>
            <h2 className='font-medium text-foreground/50 text-sm'>
                {subtitle}
            </h2>
        </div>
    )
}