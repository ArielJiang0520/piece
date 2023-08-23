'use client'
import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { EmptyFandom, Fandom, FandomMediaType, WorldDescriptionSectionCard } from '@/types/types';
import { ImagesUpload } from '@/components/ui/image/ImagesUpload';
import { TagsBar } from './tags-helpers';
import { Formik, Field, FormikHelpers, FormikState, FormikProps, Form, ErrorMessage, FieldProps } from 'formik';
import { TextInput, TextInputWithEnter } from './InputTextField';
import { FieldTitleDisplay } from '../display/display-helpers';
import SearchBar from './SearchBar';
import { fetch_all_fandom_media_types } from '@/utils/data-helpers';

interface LineInputProps {
    inputValue: string,
    setInputValue: (arg: string) => void;
}

function LineInput({ inputValue, setInputValue }: LineInputProps) {
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

interface CardInputProps {
    inputValue: WorldDescriptionSectionCard,
    setInputValue: (arg: WorldDescriptionSectionCard) => void;
}

function CardInput({ inputValue, setInputValue }: CardInputProps) {
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
            <FieldTitleDisplay label={"related images"} />
            <ImagesUpload
                dimension={{ height: "h-72", width: "w-72" }}
                initPaths={inputValue.cardImages}
                setValues={(paths) => handleImageChange(paths)}
                folder={``}
                bucket={"world"}
                maxNum={3}
            />
        </div>
    )
}


interface FandomInputProps {
    inputValue: Fandom,
    setInputValue: (arg: Fandom) => void;
}

function FandomInput({ inputValue, setInputValue }: FandomInputProps) {
    const [fandomMediaTypes, setFandomMediaTypes] = useState<FandomMediaType[]>([]);

    useEffect(() => {
        const fetchData = async () => setFandomMediaTypes(await fetch_all_fandom_media_types());
        fetchData();
    }, [])

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
            {({ isSubmitting, isValid, values, errors, touched, setValues, resetForm, setFieldValue, setErrors, setSubmitting, handleChange }) => {
                useEffect(() => {
                    setInputValue(values);
                }, [values]);

                return (
                    <Form className='flex flex-col space-y-3 items-start' onKeyDown={handleKeyDown}>
                        <div id="title-group" className='w-full flex flex-col space-y-1'>
                            <FieldTitleDisplay label={"fandom name"} />
                            <TextInput name={"name"} placeholder={"Add fandom name"} textSize={"text-base"} multiline={1} />
                        </div>
                        <div id="tags-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"any aliases?"} />
                            <TextInputWithEnter
                                textSize="text-base"
                                placeholder='After every alias, hit enter'
                                onEnter={(input: string) => setFieldValue('aliases', [...values.aliases, input])}
                            />
                            <TagsBar
                                values={values.aliases}
                                handleValuesChange={(values) => setFieldValue('aliases', values)}
                            />
                        </div>
                        <div id="media-type-group" className='w-full flex flex-col space-y-2'>
                            <FieldTitleDisplay label={"media type"} />
                            <SearchBar
                                candidates={fandomMediaTypes}
                                nameKey='name'
                                placeholder='Select a media type'
                                onSelect={(item: any) => setFieldValue('media_type', item.id)}
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
    dialogType: "input" | "edit-card" | "confirm" | "display" | "publish-piece" | "add-fandom";

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
            className="relative z-10"
            open={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-11/12 max-h-2-3-screen max-w-lg rounded px-8 py-6 bg-background shadow-lg transform transition-transform duration-500 overflow-y-auto">
                    <Dialog.Title className="text-base font-semibold text-foreground">{dialogTitle}</Dialog.Title>
                    <Dialog.Description className="text-foreground mt-4">
                        {dialogContent}

                    </Dialog.Description>

                    {dialogType === "input" && < LineInput inputValue={inputValue} setInputValue={setInputValue} />}

                    {dialogType === "display" && <DialogDisplay children={initInputValue} />}

                    {dialogType === "edit-card" && <CardInput inputValue={inputValue} setInputValue={setInputValue} />}

                    {dialogType === "publish-piece" && <CardInput inputValue={inputValue} setInputValue={setInputValue} />}

                    {dialogType === "add-fandom" && <FandomInput inputValue={inputValue} setInputValue={setInputValue} />}

                    {hideActionButtons ? null : <div className="mt-8 flex flex-row justify-end items-center space-x-4">
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
                    </div>}
                </Dialog.Panel>
            </div>

        </Dialog>
    );
}
