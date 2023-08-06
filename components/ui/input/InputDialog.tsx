'use client'
import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { WorldDescriptionSectionCard } from '@/types/types.world';
import { ImagesUpload } from '@/components/ui/image/ImagesUpload';
import { useDraftContext } from '@/app/create-a-world/draft-provider';

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
    const { currentDraft } = useDraftContext()
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        setInputValue({
            ...inputValue,
            [(id === "cardTitle") ? "cardTitle" : "cardContent"]: value
        });
    };

    const handleImageChange = (paths: string[]) => {
        setInputValue({
            ...inputValue,
            ["cardImages"]: paths
        });
    }

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
            <ImagesUpload
                dimension={{ height: "h-48", width: "w-48" }}
                initPaths={inputValue.cardImages}
                setValues={(paths) => handleImageChange(paths)}
                folder={`${currentDraft.id}/`}
                bucket={"world"}
            />
        </div>
    )
}


interface DialogDisplayProps {
    children: React.ReactNode
}

function DialogDisplay({ children }: DialogDisplayProps) {
    return (
        <>{children}</>
    )
}

interface DialogProps {
    dialogType: "input" | "edit-card" | "confirm" | "display"

    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;

    dialogTitle: string;
    dialogContent: string;

    initInputValue: any;
    confirmAction: (...args: any[]) => void;

    overwriteConfirm?: string
    hideCancel?: boolean

    additionalInfo?: {
        [key: string]: any;
    };
}

export function InputDialog({
    dialogType,
    isOpen, setIsOpen,
    dialogTitle, dialogContent,
    initInputValue, confirmAction,
    overwriteConfirm = "Confirm", hideCancel = false,
    additionalInfo = {}
}: DialogProps) {
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
                <Dialog.Panel className="w-11/12 max-h-2-3-screen max-w-lg rounded px-8 py-6 bg-background shadow-lg transform transition-transform duration-500 overflow-y-auto">
                    <Dialog.Title className="text-base font-semibold text-foreground">{dialogTitle}</Dialog.Title>
                    <Dialog.Description className="text-foreground">
                        {dialogContent}
                    </Dialog.Description>

                    {dialogType === "input" && < DialogLineInput inputValue={inputValue} setInputValue={setInputValue} />}

                    {dialogType === "display" && <DialogDisplay children={initInputValue} />}

                    {dialogType === "edit-card" && <DialogCardInput inputValue={inputValue} setInputValue={setInputValue} />}

                    <div className="mt-8 flex flex-row justify-end items-center space-x-4">
                        {hideCancel ? null : <button
                            onClick={() => setIsOpen(false)}
                            className="px-1 text-base secondaryButton"
                        >
                            Cancel
                        </button>}

                        <button
                            onClick={handleButtonClick}
                            className="px-2 py-1 text-base primaryButton"
                        >
                            {overwriteConfirm}
                        </button>
                    </div>
                </Dialog.Panel>
            </div>

        </Dialog>
    );
}
