
import { Disclosure } from '@headlessui/react';
import { PencilIcon, TrashIcon, PlusCircleIcon } from '@/components/icon/icon';
import { useState } from 'react'
import { WorldDescriptionSection, WorldDescriptionSectionCard } from '@/types/types';
import PopupDialog from '@/components/ui/input/PopupDialog';
import { SectionCard } from '@/components/ui/display/World/SectionCard';
import { AccordionIcon } from '@/components/icon/icon';

interface AccordionSectionProps {
    index: number,
    section: WorldDescriptionSection;
    delSection: (index: number) => void;
    renameSection: (index: number, newTitle: string) => void;
    addCard: (index: number) => void;
    editCard: (index: number, newCard: WorldDescriptionSectionCard, newCardIndex: number) => void;
    delCard: (index: number, newCardIndex: number) => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ index, section, delSection, renameSection, addCard, editCard, delCard }) => {
    const [dialogueRenameIsOpen, setDialogRenameIsOpen] = useState(false)
    const [dialogueDelIsOpen, setDialogDelIsOpen] = useState(false)

    const [delCardIndex, setDelCardIndex] = useState(-1);

    const deleteCard = (cardIndex: number) => {
        delCard(index, cardIndex)
        setDelCardIndex(-1)
    }

    return (
        <li className="">
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

                            <div className='flex flex-row space-x-2'>
                                <PencilIcon className='cursor-pointer' onClick={() => setDialogRenameIsOpen(true)} />
                                <TrashIcon className='cursor-pointer' onClick={() => setDialogDelIsOpen(true)} />
                            </div>

                            <PopupDialog
                                isOpen={dialogueRenameIsOpen}
                                setIsOpen={setDialogRenameIsOpen}
                                dialogTitle={"Rename Section:"}
                                dialogContent={""}
                                initInputValue={section.sectionTitle}
                                confirmAction={(newTitle: string) => renameSection(index, newTitle)}
                                dialogType='input'
                            />
                            <PopupDialog
                                isOpen={dialogueDelIsOpen}
                                setIsOpen={setDialogDelIsOpen}
                                dialogTitle={`Delete Section`}
                                dialogContent={`Are you sure you want to delete "${section.sectionTitle}"?`}
                                initInputValue={index}
                                confirmAction={() => delSection(index)}
                                dialogType='confirm'
                            />
                        </div>

                        <Disclosure.Panel className="py-4 grid grid-col-1 gap-2 max-w-4xl">
                            <>
                                {section.sectionCards.map((card, cardIndex) =>
                                    <SectionCard key={card.id} card={card} onSave={(newCard: WorldDescriptionSectionCard) => editCard(index, newCard, cardIndex)} onDel={() => setDelCardIndex(cardIndex)} />
                                )}
                                <div className='flex flex-row cursor-pointer border p-3 text-base justify-center items-center w-auto rounded-lg font-mono text-foreground/50 font-medium space-x-3'
                                    onClick={() => addCard(index)}>
                                    <PlusCircleIcon />
                                    <span>Add New Card</span>
                                </div>
                            </>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            {delCardIndex != -1 && <PopupDialog
                isOpen={delCardIndex !== -1}
                setIsOpen={() => setDelCardIndex(-1)}
                dialogTitle={`Delete Card`}
                dialogContent={`Are you sure you want to delete "${section.sectionCards[delCardIndex].cardTitle}"?`}
                initInputValue={delCardIndex}
                confirmAction={deleteCard}
                dialogType='confirm'
            />}
        </li>
    );
}



export default AccordionSection;