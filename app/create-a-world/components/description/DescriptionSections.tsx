import AccordionSection from './AccordionSection';
import { useState, useEffect } from 'react';
import { WorldDescriptionSection, WorldDescriptionSectionCard } from '@/types/types.world';

interface AccordionListProps {
    formSections: WorldDescriptionSection[]
    setFieldValue: (field: string, value: any) => void;
}

export default function DescriptionSections({ formSections, setFieldValue }: AccordionListProps) {
    const [sections, setSections] = useState<WorldDescriptionSection[]>(formSections);
    const [newSectionName, setNewSectionName] = useState('')

    useEffect(() => {
        setSections(formSections);
    }, [formSections]);

    useEffect(() => {
        setFieldValue("description", sections);
    }, [sections, setFieldValue])

    const addSection = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            const newSection: WorldDescriptionSection = {
                sectionTitle: newSectionName,
                sectionCards: []
            };
            setSections(prevSections => [...prevSections, newSection]);
            setNewSectionName('')
        }
    }

    const delSection = (index: number) => {
        const newSections = sections.filter((section, i) => i !== index)
        setSections(newSections)
    }

    const renameSection = (index: number, newTitle: string) => {
        const sectionsCopy = [...sections];
        sectionsCopy[index].sectionTitle = newTitle;
        setSections(sectionsCopy);
    }

    const addCard = (index: number, newCard: WorldDescriptionSectionCard) => {
        const sectionsCopy = [...sections];
        if (!newCard.cardTitle)
            newCard.cardTitle = 'Untitled Card'
        sectionsCopy[index].sectionCards.push(newCard);
        setSections(sectionsCopy);
    }

    const editCard = (index: number, newCard: WorldDescriptionSectionCard, cardIndex: number) => {
        const sectionsCopy = [...sections];
        sectionsCopy[index].sectionCards[cardIndex] = newCard
        setSections(sectionsCopy);
    }

    const delCard = (index: number, cardIndex: number) => {
        const sectionsCopy = [...sections];
        const cardsCopy = [...sectionsCopy[index].sectionCards];
        cardsCopy.splice(cardIndex, 1);
        sectionsCopy[index].sectionCards = cardsCopy;
        setSections(sectionsCopy);
    }

    const handleSectionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewSectionName(event.target.value);
    }

    return (
        <div className='flex flex-col justify-start'>
            <ul className='font-serif space-y-3'>
                {sections.map((section, index) => (
                    <AccordionSection key={index} index={index} section={section}
                        delSection={delSection}
                        renameSection={renameSection}
                        addCard={addCard}
                        editCard={editCard}
                        delCard={delCard}
                    />
                ))}
                <input
                    type="text"
                    value={newSectionName}
                    className="text-2xl md:text-3xl singleLineInput"
                    placeholder="Add a new section..."
                    onChange={handleSectionNameChange}
                    onKeyDown={addSection}
                />
            </ul>
        </div>
    )
}   