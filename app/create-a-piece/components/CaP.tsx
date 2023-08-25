'use client'
import { Formik, Field, FormikProps, Form, ErrorMessage, FieldProps } from 'formik';
import { AccordionIcon } from '@/components/icon/icon';
import { TextInput } from '@/components/ui/input/InputTextField';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import { useEffect, useRef, useState } from 'react';
import { PiecePayload, PieceSettingsAsks, cast_to_piecepayload, World, EmptyPiecePayload } from '@/types/types';
import { useSupabase } from '@/app/supabase-provider';
import SettingGroup from '@/components/ui/button/toggle/SettingGroup';
import { Disclosure } from '@headlessui/react';
import { ImagesUpload } from '@/components/ui/image/ImagesUpload';
import FolderSelector from './FolderSelector';
import { LoadingOverlay } from '@/components/ui/widget/loading';
import { useDraftContext } from '../draft-provider';
import PublishButton from './buttons/PublishButton';
import PreviewButton from './buttons/PreviewButton';
import SaveDraftButton from './buttons/SaveDraftButton';
import Link from 'next/link';
import ChooseTags from './ChooseTags';

interface CaPProps {
    world: World,
    initValues?: PiecePayload | null;
}
export default function CaP({ world, initValues = null }: CaPProps) {
    const { currentDraft, fetchDrafts } = useDraftContext();

    const { user } = useSupabase()

    const formikRef = useRef<FormikProps<PiecePayload> | null>(null); // Adding a ref to Formik
    useEffect(() => {

        if (formikRef.current) {
            if (initValues) {
                formikRef.current.resetForm({ values: initValues });
            } else {
                const newValues: PiecePayload = "default" in currentDraft ? EmptyPiecePayload : cast_to_piecepayload(currentDraft)
                formikRef.current.resetForm({ values: newValues });
            }
        }
    }, [currentDraft])  // Resetting the form whenever currentDraft changes

    if (!world || !user)
        return <>Loading...</>

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && (event.target as HTMLElement).nodeName !== 'TEXTAREA') {
            event.preventDefault();
        }
    };


    return (
        <>

            <Formik
                initialValues={EmptyPiecePayload}
                onSubmit={() => { }}
                innerRef={formikRef}
            >
                {({ isSubmitting, isValid, values, errors, touched, setFieldValue, setSubmitting, setErrors }) => (
                    <Form className='flex flex-col space-y-6 items-start' onKeyDown={handleKeyDown}>
                        <div id="title-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"title"} />
                            <TextInput name={"name"} placeholder={"Add your title..."} textSize={"text-2xl"} multiline={1} bold={"font-bold"} />
                        </div>


                        <div id="images-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"images"} />
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

                        <div id="tags-group" className='w-full flex flex-col max-w-2xl space-y-2'>
                            <FieldTitleDisplay label={"tags"} />
                            <ChooseTags />
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


                        <div id="submit-group" className='flex flex-col w-full items-center justify-center space-y-3'>
                            <div className='w-full max-w-lg flex flex-row items-center space-x-1'>
                                <div className='flex-grow h-10'>
                                    <PublishButton uid={user.id} wid={world.id} values={values} currentDraft={currentDraft} setSubmitting={setSubmitting} />
                                </div>
                                <div className='w-10 h-10'>
                                    <PreviewButton user={user} world={world} values={values} />
                                </div>
                            </div>
                            <div className='w-full max-w-lg flex flex-row items-center justify-center space-x-4'>
                                <SaveDraftButton uid={user.id} wid={world.id} values={values} currentDraft={currentDraft} setSubmitting={setSubmitting} fetchDrafts={fetchDrafts} />
                                <Link href={'default' in currentDraft || currentDraft.is_draft ? `/` : `/worlds/${world.id}`} >
                                    <button className="p-2 secondaryButton text-lg" type="button">
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </div>
                        {isSubmitting && <LoadingOverlay />}
                    </Form>
                )}
            </Formik>
        </>
    )
}