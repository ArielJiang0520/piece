'use client'
import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { ChatHistoryJson, GenPieceJson, TypedPiece } from '@/types/types';
import { TagsBar } from './tags-helpers';
import { Formik, Form } from 'formik';
import { TextInput, TextInputFreeform, TextInputWithEnter } from './InputTextField';
import { FieldTitleDisplay, Markdown } from '../display/display-helpers';
import SearchBar from './SearchBar';
import { ChatHistoryDisplay, GenPieceDisplay } from '../display/Piece/piece-display-helpers';
import FolderSelector from './FolderSelector';

interface LineInputProps {
    inputValue: string,
    setInputValue: (arg: string) => void;
}

function LineInput({ inputValue, setInputValue }: LineInputProps) {
    return <TextInputFreeform
        initValue={inputValue}
        onChange={(newString: string) => setInputValue(newString)}
        placeholder={''}
        textSize='text-2xl'
        multiline={1}
    />
}


function PublishSpecialPiece({ inputValue, setInputValue }: {
    inputValue: TypedPiece, setInputValue: (arg: TypedPiece) => void;
}) {
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && (event.target as HTMLElement).nodeName !== 'TEXTAREA') {
            event.preventDefault();
        }
        if (event.key === ' ') {
            event.stopPropagation();
        }
    };
    return (
        <Formik
            initialValues={inputValue}
            onSubmit={(values) => { setInputValue(values) }}
        >
            {({ isSubmitting, isValid, values, setFieldValue }) => {
                useEffect(() => {
                    setInputValue(values);
                }, [values]);

                return (
                    <Form className='flex flex-col space-y-3 items-start font-mono' onKeyDown={handleKeyDown}>

                        <div id="title-group" className='w-full flex flex-col space-y-1'>
                            <FieldTitleDisplay label={"title"} />
                            <TextInput name={"name"} placeholder={"Add your title"} textSize={"text-base"} multiline={1} />
                        </div>

                        <div id="folder-group" className='w-full flex flex-col '>
                            <FieldTitleDisplay label={"folder"} />
                            <FolderSelector wid={values.world_id} />
                        </div>

                        {values.type === "roleplay" && <ChatHistoryDisplay json_content={values.json_content as ChatHistoryJson} />}
                        {values.type === "gen-piece" && <GenPieceDisplay json_content={values.json_content as GenPieceJson} />}

                        <div id="notes-group" className='w-full flex flex-col space-y-1'>
                            <FieldTitleDisplay label={"notes"} />
                            <TextInput name={"json_content.notes"} placeholder={"(optional) Add your notes"} textSize={"text-sm"} multiline={3} />
                        </div>

                        <div id="tags-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"tags"} />
                            <TextInputWithEnter
                                textSize="text-sm"
                                placeholder='After typing every tag, hit enter'
                                onEnter={(input: string) => setFieldValue('tags', [...values.tags, input])}
                            />
                            <TagsBar
                                values={values.tags}
                                handleValuesChange={(values) => setFieldValue('tags', values)}
                            />
                        </div>

                    </Form>
                )
            }}
        </Formik>
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
    dialogType: "input" | "confirm" | "display" | "publish-special-piece";

    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;

    dialogTitle: string;
    dialogContent: string;

    initInputValue: any;
    confirmAction: (...args: any[]) => void;

    overwriteConfirm?: string
    hideCancel?: boolean
    hideActionButtons?: boolean
}

export default function PopupDialog({
    dialogType,
    isOpen, setIsOpen,
    dialogTitle, dialogContent,
    initInputValue, confirmAction,
    overwriteConfirm = "Confirm",
    hideCancel = false,
    hideActionButtons = false
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
            className="relative z-50"
            open={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4 font-mono">
                <Dialog.Panel className="w-11/12 max-h-2-3-screen max-w-lg rounded px-8 py-6 bg-background shadow-lg transform transition-transform duration-500 overflow-y-auto">
                    <Dialog.Title className="text-base font-semibold text-foreground">{dialogTitle}</Dialog.Title>
                    <Dialog.Description className="text-foreground mt-4">
                        {dialogContent}

                    </Dialog.Description>

                    {dialogType === "input" && < LineInput inputValue={inputValue} setInputValue={setInputValue} />}

                    {dialogType === "display" && <DialogDisplay children={initInputValue} />}

                    {dialogType === "publish-special-piece" && <PublishSpecialPiece inputValue={initInputValue} setInputValue={setInputValue} />}

                    {hideActionButtons ? null : <div className="mt-8 flex flex-row justify-end items-center space-x-4">
                        {hideCancel ? null : <button
                            onClick={() => setIsOpen(false)}
                            className="px-1 text-base secondaryButton"
                        >
                            Cancel
                        </button>}

                        <button
                            onClick={handleButtonClick}
                            className="px-2 py-1 text-base primaryButton rounded-lg"
                        >
                            {overwriteConfirm}
                        </button>
                    </div>}
                </Dialog.Panel>
            </div>

        </Dialog>
    );
}
