'use client'
import { Formik, Field, FormikProps, Form, ErrorMessage, FieldProps } from 'formik';
import { EyeIcon, AccordionIcon } from '@/components/icon/icon';
import TextInput from '@/components/ui/input/InputTextField';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import AutocompleteBox from '@/components/ui/input/AutoCompleteBar';
import { TagsBar } from '@/components/ui/input/tags-helpers';
import PopupDialog from '@/components/ui/input/PopupDialog';
import { useEffect, useRef, useState } from 'react';
import { publishPiece } from '@/utils/piece-helpers';
import { PiecePayload, PieceSettingsAsks, cast_to_piece, World } from '@/types/types.world';
import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';
import SettingGroup from '@/components/ui/button/toggle/SettingGroup';
import { Disclosure } from '@headlessui/react';
import PieceDisplay from '@/components/ui/display/Piece/PieceDisplay';
import { ImagesUpload } from '@/components/ui/image/ImagesUpload';
import FolderSelector from './FolderSelector';

interface CaPProps {
    world: World,
    initValues: PiecePayload;
    review?: boolean
}
export default function CaP({ world, initValues, review = true }: CaPProps) {

    const [isPreviewPieceOpen, setIsPreviewPieceOpen] = useState(false)

    const { user } = useSupabase()
    const router = useRouter()

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
            await publishPiece(values, world.id, user.id)
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        } finally {
            setSubmitting(false)
            router.push(`/world/${world.id}/pieces`)
        }
    }

    return (
        <>

            <Formik
                initialValues={initValues}
                onSubmit={(values, formikHelpers) => {
                    console.log('submitted values', values);
                    if (review)
                        setIsPreviewPieceOpen(true);
                    else
                        onPublishPiece(values, formikHelpers.setSubmitting)
                }}
            >
                {({ isSubmitting, isValid, values, errors, touched, setFieldValue, setSubmitting, setErrors }) => (
                    <Form className='flex flex-col space-y-6 items-start' onKeyDown={handleKeyDown}>



                        <div id="title-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"title"} />
                            <TextInput name={"title"} placeholder={"Add your title..."} textSize={"text-2xl"} multiline={1} bold={"font-bold"} />
                        </div>

                        <div id="logline-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"logline"} />
                            <TextInput name={"logline"} placeholder={"Add your logline..."} textSize={"text-lg"} multiline={2} bold={"font-medium"} />
                        </div>

                        <div id="cover-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"cover"} />
                            <ImagesUpload
                                dimension={{ height: "h-56", width: "w-56" }}
                                bucket={"world"}
                                folder={``}
                                initPaths={values.images}
                                setValues={(paths) => setFieldValue('images', paths)}
                                maxNum={10}
                            />
                        </div>


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

                        <div id="content-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"content"} />
                            <TextInput name={"content"} placeholder={"Add your content..."} textSize={"text-base"} multiline={25} bold={"font-medium"} />
                        </div>

                        <div id="settings-group" className='w-full flex flex-col'>
                            <Disclosure>
                                {({ open }) => (
                                    <>
                                        <div className='flex flex-row items-center space-x-2'>
                                            <FieldTitleDisplay label={"settings"} />
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
                                {review ? "Review & Publish" : "Publish"}
                            </button>
                        </div>



                        <PopupDialog
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