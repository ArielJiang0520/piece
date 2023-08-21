
import { Disclosure } from '@headlessui/react';
import { PencilIcon, DotsVerticalIcon, TrashIcon } from '@/components/icon/icon';
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { WorldDescriptionSection, WorldDescriptionSectionCard } from '@/types/types.world';
import { DropDownMenuOptions, DropDownMenu } from '@/components/ui/menu/InPlaceDropDownMenu';
import PopupDialog from '@/components/ui/input/PopupDialog';
import { SectionCard, AddSectionCard } from '@/components/ui/display/World/SectionCard';


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
    const [dialogueRenameIsOpen, setDialogRenameIsOpen] = useState(false)
    const [dialogueDelIsOpen, setDialogDelIsOpen] = useState(false)

    const [addCardDialogIsOpen, setAddCardDialogIsOpen] = useState(false)
    const [editingCard, setEditingCard] = useState<null | { card: WorldDescriptionSectionCard, index: number }>(null);
    const [delCardIndex, setDelCardIndex] = useState(-1);

    const onDropdownClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const onDeleteSection = () => {
        setDropdownVisible(!dropdownVisible);
        setDialogDelIsOpen(true)

    };

    const onRenameSection = () => {
        setDropdownVisible(!dropdownVisible);
        setDialogRenameIsOpen(true)
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
                                    onClick={onDropdownClick}
                                />
                                {dropdownVisible && <DropDownMenu setDropdownVisible={setDropdownVisible} options={menuOptions} />}
                            </div>

                            <PopupDialog
                                isOpen={dialogueRenameIsOpen}
                                setIsOpen={setDialogRenameIsOpen}
                                dialogTitle={"Rename Section:"}
                                dialogContent={""}
                                initInputValue={section.sectionTitle}
                                confirmAction={changeTitle}
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

                        <Disclosure.Panel className="py-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 grid-flow-row w-full gap-4">
                            {
                                section.sectionCards.length >= 1 ?
                                    <>
                                        {section.sectionCards.map((card, index) =>

                                            <SectionCard
                                                key={index}
                                                index={index}
                                                card={card}
                                                onclick={onEditCard}
                                                ondel={onDelCard}
                                            />

                                        )}

                                        <AddSectionCard text={"Add New Card"} onclick={onAddNewSection} />

                                    </> :

                                    <AddSectionCard text={"Add New Card"} onclick={onAddNewSection} />

                            }

                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <PopupDialog
                isOpen={addCardDialogIsOpen}
                setIsOpen={setAddCardDialogIsOpen}
                dialogTitle={"Add New Card"}
                dialogContent={""}
                initInputValue={{ cardTitle: "", cardContent: "", cardImages: [] } as WorldDescriptionSectionCard}
                confirmAction={saveNewCard}
                dialogType='edit-card'
            />
            {editingCard && (
                <PopupDialog
                    isOpen={!!editingCard}
                    setIsOpen={() => setEditingCard(null)}
                    dialogTitle={`Edit Card (@${section.sectionTitle})`}
                    dialogContent={""}
                    initInputValue={editingCard.card}
                    confirmAction={saveEditedCard}
                    dialogType='edit-card'
                />
            )}
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