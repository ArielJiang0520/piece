
import { Disclosure } from '@headlessui/react';
import { PencilIcon, DotsVerticalIcon, TrashIcon, PlusCircleIcon } from '@/components/icon/icon';
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { WorldDescriptionSection, WorldDescriptionSectionCard } from '@/types/types';
import { DropDownMenuOptions, DropDownMenu } from '@/components/ui/menu/InPlaceDropDownMenu';
import PopupDialog from '@/components/ui/input/PopupDialog';
import { SectionCard } from '@/components/ui/display/World/SectionCard';


interface AccordionSectionProps {
    index: number,
    section: WorldDescriptionSection;
    delSection: (index: number) => void;
    renameSection: (index: number, newTitle: string) => void;
    addCard: (index: number, newCard: WorldDescriptionSectionCard) => void;
    editCard: (index: number, newCard: WorldDescriptionSectionCard, newCardIndex: number) => void;
    delCard: (index: number, newCardIndex: number) => void;
}

const emptyCard = { cardTitle: '', cardContent: '', cardImages: [] } as WorldDescriptionSectionCard

const AccordionSection: React.FC<AccordionSectionProps> = ({ index, section, delSection, renameSection, addCard, editCard, delCard }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dialogueRenameIsOpen, setDialogRenameIsOpen] = useState(false)
    const [dialogueDelIsOpen, setDialogDelIsOpen] = useState(false)

    const [delCardIndex, setDelCardIndex] = useState(-1);

    const onDeleteSection = () => {
        setDropdownVisible(!dropdownVisible);
        setDialogDelIsOpen(true)
    };

    const onRenameSection = () => {
        setDropdownVisible(!dropdownVisible);
        setDialogRenameIsOpen(true)
    };

    const deleteCard = (cardIndex: number) => {
        delCard(index, cardIndex)
        setDelCardIndex(-1)
    }

    const menuOptions: DropDownMenuOptions[] = [
        { name: 'Rename', icon: PencilIcon, function: onRenameSection },
        { name: 'Delete', icon: TrashIcon, function: onDeleteSection }
    ]

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

                                <Disclosure.Button>
                                    <ChevronRightIcon className={`${open ? 'transform rotate-90' : ''} w-5 h-5`} />
                                </Disclosure.Button>
                            </div>

                            <div className='relative z-10'>
                                <DotsVerticalIcon
                                    className='cursor-pointer'
                                    size={20}
                                    onClick={() => setDropdownVisible(!dropdownVisible)}
                                />
                                {dropdownVisible && <DropDownMenu setDropdownVisible={setDropdownVisible} options={menuOptions} />}
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

                        <Disclosure.Panel className="py-4 grid grid-col-1 gap-2">
                            <>
                                {section.sectionCards.map((card, cardIndex) =>
                                    <SectionCard key={index} card={card} onSave={(newCard: WorldDescriptionSectionCard) => editCard(index, newCard, cardIndex)} onDel={() => setDelCardIndex(cardIndex)} />
                                )}
                                <div className='flex flex-row cursor-pointer border p-3 text-base justify-center items-center w-auto rounded-lg font-mono text-foreground/50 font-medium space-x-3'
                                    onClick={() => addCard(index, emptyCard)}>
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