import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { WorldDescriptionSectionCard } from '@/types/types.world';

interface DialogLineInputProps {
    inputValue: string,
    setInputValue: (arg: string) => void;
}

function DialogLineInput({ inputValue, setInputValue }: DialogLineInputProps) {
    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };
    return (<input
        type="text"
        className="w-full singleLineInput text-2xl"
        placeholder={'New title...'}
        value={inputValue}
        onChange={handleInputChange}
    />)
}

interface DialogCardInputProps {
    inputValue: WorldDescriptionSectionCard,
    setInputValue: (arg: WorldDescriptionSectionCard) => void;
}

function DialogCardInput({ inputValue, setInputValue }: DialogCardInputProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        setInputValue({
            ...inputValue,
            [(id === "cardTitle") ? "cardTitle" : "cardContent"]: value
        });
    };

    return (
        <div>
            <input
                id="cardTitle"
                type="text"
                className="w-full singleLineInput text-2xl"
                placeholder={'New title...'}
                value={inputValue.cardTitle}
                onChange={handleInputChange}
            />
            <textarea
                id="cardContent"
                className="w-full min-h-[300px] multiLineInput text-base"
                placeholder={'New content...'}
                value={inputValue.cardContent}
                onChange={handleInputChange}
            />
        </div>
    )
}

interface DialogProps {
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    dialogTitle: string;
    dialogContent: string;
    initInputValue: any;
    confirmAction: (...args: any[]) => void;
    dialogType: "input" | "form" | "confirm"
}

export function InputDialog({ isOpen, setIsOpen, dialogTitle, dialogContent, initInputValue, confirmAction, dialogType }: DialogProps) {
    const [inputValue, setInputValue] = useState(initInputValue);

    const handleButtonClick = () => {
        confirmAction(inputValue);
        setIsOpen(false);
    };

    useEffect(() => {
        setInputValue(initInputValue);
    }, [initInputValue]);

    return (
        <Dialog
            className="relative"
            open={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-2/3 max-w-sm rounded px-8 py-6 bg-background shadow-lg transform transition-transform duration-500">
                    <Dialog.Title className="text-base font-semibold text-foreground">{dialogTitle}</Dialog.Title>
                    <Dialog.Description className="text-foreground">
                        {dialogContent}
                    </Dialog.Description>

                    {dialogType === "input" && < DialogLineInput inputValue={inputValue} setInputValue={setInputValue} />}
                    {dialogType === "form" && <DialogCardInput inputValue={inputValue} setInputValue={setInputValue} />}

                    <div className="mt-8 flex flex-row justify-end items-center space-x-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-1 text-base secondaryButton"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleButtonClick}
                            className="px-2 py-1 text-base primaryButton"
                        >
                            Confirm
                        </button>
                    </div>

                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
