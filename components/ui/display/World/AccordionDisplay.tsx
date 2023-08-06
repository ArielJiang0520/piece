'use client';
import React from 'react';
import { WorldDescriptionSection } from "@/types/types.world";
import { Disclosure } from '@headlessui/react';
import { AccordionIcon } from '@/components/icon/icon';
import { SectionCard } from '@/components/ui/display/World/SectionCard';

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
                                                index={index}
                                                card={card}
                                                onclick={() => { }}
                                                ondel={() => { }}
                                                display={true}
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