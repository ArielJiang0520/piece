'use client';
import React from 'react';
import { WorldDescriptionSection } from "@/types/types";
import { Disclosure } from '@headlessui/react';
import { AccordionIcon } from '@/components/icon/icon';
import { SectionCardDisplay } from '@/components/ui/display/World/SectionCard';

interface AccordionDisplayProps {
    sections: WorldDescriptionSection[];
    preview: boolean
}

export const AccordionDisplay: React.FC<AccordionDisplayProps> = ({ sections, preview }) => {
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

                                            <div className='flex items-center justify-center bg-foreground/5 text-xs font-mono rounded-full w-5 h-5 p-3'>
                                                {section.sectionCards.length}
                                            </div>

                                            <Disclosure.Button>
                                                <AccordionIcon className={`${open ? 'transform rotate-90' : ''} w-5 h-5`} />
                                            </Disclosure.Button>
                                        </div>
                                    </div>
                                    <Disclosure.Panel className="py-4 flex flex-col space-y-4 max-w-4xl">
                                        {section.sectionCards.map((card, index) =>
                                            <SectionCardDisplay key={index} card={card} />
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