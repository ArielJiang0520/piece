
import { Disclosure } from '@headlessui/react';
import { BsThreeDotsVertical, BsFillTrashFill } from 'react-icons/bs';
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { RiPencilFill } from 'react-icons/ri'
import { useState, useEffect } from 'react'

import { WorldDescriptionSection, WorldDescriptionSectionCard } from '@/types/types.world';
import { DropDownMenuOptions, DropDownMenu } from '@/components/ui/menu/DropDownMenu';
import { InputDialog } from '@/components/ui/input/InputDialog';
import { NewSectionCard, SectionCard } from './SectionCard';


interface AccordionSectionProps {
    index: number,
    section: WorldDescriptionSection;
    delSection: (index: number) => void;
    renameSection: (index: number, newTitle: string) => void;
    addCard: (index: number, newCard: WorldDescriptionSectionCard) => void;
    editCard: (index: number, newCard: WorldDescriptionSectionCard, newCardIndex: number) => void;
    delCard: (index: number, newCardIndex: number) => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ index, section, delSection, renameSection, addCard, editCard, delCard }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dialogueIsOpen, setDialogIsOpen] = useState(false)

    const [addCardDialogIsOpen, setAddCardDialogIsOpen] = useState(false)
    const [editingCard, setEditingCard] = useState<null | { card: WorldDescriptionSectionCard, index: number }>(null);
    const [delCardIndex, setDelCardIndex] = useState(-1);

    const onDropdownClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const onDeleteSection = () => {
        setDropdownVisible(!dropdownVisible);
        delSection(index)
    };

    const onRenameSection = () => {
        setDropdownVisible(!dropdownVisible);
        setDialogIsOpen(true)
    };

    const changeTitle = (newTitle: string) => {
        renameSection(index, newTitle)
    }

    const onAddNewSection = () => {
        setAddCardDialogIsOpen(true)
    }

    const saveNewCard = (newCard: WorldDescriptionSectionCard) => {
        addCard(index, newCard)
    }

    const onEditCard = (cardIndex: number) => {
        const cardCopy = { ...section.sectionCards[cardIndex] };
        setEditingCard({ card: cardCopy, index: cardIndex });
    };

    const saveEditedCard = (newCard: WorldDescriptionSectionCard) => {
        if (editingCard) {
            editCard(index, newCard, editingCard.index);
            setEditingCard(null);
        }
    };

    const onDelCard = (cardIndex: number) => {
        setDelCardIndex(cardIndex)
    }

    const deleteCard = (cardIndex: number) => {
        delCard(index, cardIndex)
        setDelCardIndex(-1)
    }

    const menuOptions: DropDownMenuOptions[] = [
        { name: 'Rename', icon: RiPencilFill, function: onRenameSection },
        { name: 'Delete', icon: BsFillTrashFill, function: onDeleteSection }
    ]

    return (
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

                            <div className='relative'>
                                <BsThreeDotsVertical
                                    className='cursor-pointer'
                                    size={20}
                                    onClick={onDropdownClick}
                                />
                                {dropdownVisible && <DropDownMenu setDropdownVisible={setDropdownVisible} options={menuOptions} />}
                            </div>

                            <InputDialog
                                isOpen={dialogueIsOpen}
                                setIsOpen={setDialogIsOpen}
                                dialogTitle={"Rename Section:"}
                                dialogContent={""}
                                initInputValue={section.sectionTitle}
                                confirmAction={changeTitle}
                                dialogType='input'
                            />
                        </div>

                        <Disclosure.Panel className="flex flex-row w-full space-x-5 justify-start p-10 overflow-x-auto">
                            {
                                section.sectionCards.length >= 1 ?
                                    <>
                                        {section.sectionCards.map((card, index) =>
                                            <SectionCard
                                                key={index}
                                                index={index}
                                                title={card.cardTitle}
                                                content={card.cardContent}
                                                onclick={onEditCard}
                                                ondel={onDelCard}
                                            />
                                        )}
                                        <NewSectionCard onclick={onAddNewSection} />
                                    </> :
                                    <NewSectionCard onclick={onAddNewSection} />
                            }
                            <InputDialog
                                isOpen={addCardDialogIsOpen}
                                setIsOpen={setAddCardDialogIsOpen}
                                dialogTitle={"Add New Card"}
                                dialogContent={""}
                                initInputValue={{ cardTitle: "", cardContent: "" }}
                                confirmAction={saveNewCard}
                                dialogType='form'
                            />
                            {editingCard && (
                                <InputDialog
                                    isOpen={!!editingCard}
                                    setIsOpen={() => setEditingCard(null)}
                                    dialogTitle={`Edit Card (@${section.sectionTitle})`}
                                    dialogContent={""}
                                    initInputValue={editingCard.card}
                                    confirmAction={saveEditedCard}
                                    dialogType='form'
                                />
                            )}
                            {delCardIndex != -1 && <InputDialog
                                isOpen={delCardIndex !== -1}
                                setIsOpen={() => setDelCardIndex(-1)}
                                dialogTitle={`Delete Card`}
                                dialogContent={`Are you sure you want to delete "${section.sectionCards[delCardIndex].cardTitle}"?`}
                                initInputValue={delCardIndex}
                                confirmAction={deleteCard}
                                dialogType='confirm'
                            />}
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </li>
    );
}



export default AccordionSection;