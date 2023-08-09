'use client'
import { Formik, Field, FormikProps, Form, ErrorMessage, FieldProps } from 'formik';
import { EyeIcon, AccordionIcon } from '@/components/icon/icon';
import TextInput from '@/components/ui/input/InputText';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import AutocompleteBox from '@/components/ui/input/AutoCompleteBar';
import { TagsBar } from '@/components/ui/display/tags-display-helpers';
import { usePieceContext } from '../piece-provider';
import WorldDisplay from '@/components/ui/display/World/WorldDisplay';
import { InputDialog } from '@/components/ui/input/InputDialog';
import { useEffect, useRef, useState } from 'react';
import { publishPiece } from '@/utils/world-helpers';
import { PiecePayload, PieceSettingsAsks, EmptyPiecePayload, cast_to_piece } from '@/types/types.world';
import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';
import SettingGroup from '@/components/ui/button/toggle/SettingGroup';
import { Disclosure } from '@headlessui/react';
import PieceDisplay from '@/components/ui/display/Piece/PieceDisplay';
import { ImagesUpload } from '@/components/ui/image/ImagesUpload';
import FolderSelector from './FolderSelector';

export default function CaPText({ inputType }: { inputType: string }) {
    const { piece_id, world, folders } = usePieceContext();
    const [isReviewWorldOpen, setIsReviewWorldOpen] = useState(false)
    const [isPreviewPieceOpen, setIsPreviewPieceOpen] = useState(false)

    const { user } = useSupabase()
    const router = useRouter()

    const formikRef = useRef<FormikProps<PiecePayload> | null>(null); // Adding a ref to Formik
    useEffect(() => {
        if (formikRef.current) {
            formikRef.current.resetForm({ values: EmptyPiecePayload });
        }
    }, [inputType])

    if (!world || !user)
        return <>Loading...</>

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && (event.target as HTMLElement).nodeName !== 'TEXTAREA') {
            event.preventDefault();
        }
    };

    const onPublishPiece = async (values: PiecePayload, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true)
        try {
            await publishPiece(values, piece_id, world.id, user.id)
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        } finally {
            setSubmitting(false)
            router.push('/')
        }
    }

    return (
        <>

            <Formik
                initialValues={EmptyPiecePayload}
                onSubmit={(values) => { console.log('submitted values', values); setIsPreviewPieceOpen(true); }}
                innerRef={formikRef}
            >
                {({ isSubmitting, isValid, values, errors, touched, setFieldValue, setSubmitting, setErrors }) => (
                    <Form className='flex flex-col space-y-6 items-start' onKeyDown={handleKeyDown}>

                        <div id="view-group" className='w-full flex flex-row justify-end items-center text-foreground/50 '>
                            <button type="button" className='flex flex-row items-center py-1 px-2 border rounded-lg space-x-1' onClick={() => setIsReviewWorldOpen(true)}>
                                <EyeIcon className='h-3 w-3' />
                                <FieldTitleDisplay label={"Peek the world"} textSize='text-xs' />
                            </button>
                        </div>

                        <div id="title-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"title"} />
                            <TextInput name={"title"} placeholder={"Add your title..."} textSize={"text-2xl"} multiline={1} bold={"font-bold"} />
                        </div>

                        <div id="logline-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"logline"} />
                            <TextInput name={"logline"} placeholder={"Add your logline..."} textSize={"text-lg"} multiline={2} bold={"font-medium"} />
                        </div>

                        {inputType === "media" && <div id="cover-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"cover"} />
                            <ImagesUpload
                                dimension={{ height: "h-56", width: "w-56" }}
                                bucket={"world"}
                                folder={`${world.id}/${piece_id}`}
                                initPaths={values.images}
                                setValues={(paths) => setFieldValue('images', paths)}
                                maxNum={10}
                            />
                        </div>}


                        {/* <div id="folder-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"folder"} />
                            <FolderSelector folders={folders} />
                        </div> */}

                        <div id="tags-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"tags"} />
                            <AutocompleteBox
                                value={values.tags}
                                setFieldValue={setFieldValue}
                            />
                            <TagsBar tags={values.tags} setFieldValue={setFieldValue} />
                        </div>

                        {inputType === "text" && <div id="content-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"content"} />
                            <TextInput name={"content"} placeholder={"Add your content..."} textSize={"text-base"} multiline={25} bold={"font-medium"} />
                        </div>}

                        <div id="settings-group" className='w-full flex flex-col'>
                            <Disclosure>
                                {({ open }) => (
                                    <>
                                        <div className='flex flex-row items-center space-x-2'>
                                            <FieldTitleDisplay label={"🔧settings"} />
                                            <Disclosure.Button>
                                                <AccordionIcon className={`${open ? 'transform rotate-90' : ''} w-5 h-5`} />
                                            </Disclosure.Button>
                                        </div>
                                        <Disclosure.Panel as={SettingGroup} settings={values.settings} asks={PieceSettingsAsks} setFieldValue={setFieldValue} />
                                    </>
                                )}
                            </Disclosure>
                        </div>


                        <div id="submit-group" className='mx-auto w-full lg:w-2/3 flex flex-col space-y-3'>
                            <button className="w-full p-3 primaryButton text-2xl" type="submit">
                                Review & Publish
                            </button>
                        </div>

                        <InputDialog
                            isOpen={isReviewWorldOpen}
                            setIsOpen={setIsReviewWorldOpen}
                            dialogTitle='You are creating a piece for...'
                            dialogContent=''
                            initInputValue={<WorldDisplay world={world} preview={true} />}
                            confirmAction={() => setIsReviewWorldOpen(false)}
                            dialogType='display'
                            overwriteConfirm='Close'
                            hideCancel={true}
                        />

                        <InputDialog
                            isOpen={isPreviewPieceOpen}
                            setIsOpen={setIsPreviewPieceOpen}
                            dialogTitle='Are you sure you want to publish this piece?'
                            dialogContent=''
                            initInputValue={<PieceDisplay piece={cast_to_piece(values)} world={world} user={user} preview={true} />}
                            confirmAction={() => onPublishPiece(values, setSubmitting)}
                            dialogType='display'
                        />

                    </Form>
                )}
            </Formik>
        </>
    )
}