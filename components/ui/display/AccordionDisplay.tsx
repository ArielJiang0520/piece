'use client';
import React, { useState } from 'react';
import { WorldDescriptionSection } from "@/types/types.world";
import { Disclosure } from '@headlessui/react';
import { AccordionIcon } from '@/components/icon/icon';
import { InputDialog } from '@/components/ui/input/InputDialog';

interface AccordionDisplayProps {
    sections: WorldDescriptionSection[];
}

export const AccordionDisplay: React.FC<AccordionDisplayProps> = ({ sections }) => {


    return (
        <div className='flex flex-col justify-start'>
            <ul className='my-5 font-serif space-y-2'>
                {sections.map((section, index) => (
                    <li key={index} className="">
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <div id="accordion-panel" className="flex flex-row justify-between items-center w-full ">
                                        <div className='flex flex-row items-center space-x-2'>
                                            <div
                                                className="font-bold text-2xl md:text-3xl overflow-hidden max-w-xs md:max-w-lg whitespace-nowrap overflow-ellipsis"
                                            >
                                                {section.sectionTitle}
                                            </div>

                                            <Disclosure.Button>
                                                <AccordionIcon className={`${open ? 'transform rotate-90' : ''} w-5 h-5`} />
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
    );
};



export const SectionCard = ({ title, content }: { title: string; content: string; }) => {
    const [isOpen, setIsOpen] = useState(false)
    function DisplayCard() {
        return <div className='flex flex-col w-full space-y-2'>
            <div className='font-serif text-2xl font-semibold'>
                {title}
            </div>
            <div className='w-full border-b-2 h-px my-2'></div>
            <div className='text-sm whitespace-pre-line'>
                {content}
            </div>
        </div>
    }
    return (
        <div id='card'
            onClick={() => setIsOpen(true)}
            className='relative flex-shrink-0 p-8 flex flex-col justify-start items-center space-y-2 border-2 cursor-pointer rounded-lg w-64 h-64'
        >
            <div className='text-center leading-snug text-2xl overflow-hidden overflow-ellipsis whitespace-nowrap w-full h-12'>
                {title}
            </div>
            <div className='w-full border-b-2 h-px'></div>
            <div className='text-xs text-left overflow-hidden overflow-ellipsis h-48 w-full whitespace-pre-line'>
                {content}
            </div>
            <InputDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                dialogTitle=''
                dialogContent=''
                initInputValue={<DisplayCard />}
                confirmAction={() => setIsOpen(false)}
                dialogType='display'
                overwriteConfirm='Okay'
                hideCancel={true}
            />
        </div>
    );



};
