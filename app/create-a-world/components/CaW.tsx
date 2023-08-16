'use client'

import { WorldPayload, WorldSettingsAsks, EmptyWorldPayload, cast_to_worldpayload, cast_to_world } from '@/types/types.world';

// create-a-world
// Need to handle input error
// Need to add "?" icon for instruction
import { useEffect, useRef, useState } from 'react';
import { useDraftContext } from '../draft-provider';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/supabase-provider';
import Link from 'next/link';
import { Formik, Field, FormikHelpers, FormikState, FormikProps, Form, ErrorMessage, FieldProps } from 'formik'; // need to validate input
import { overwriteDraft, saveNewDraft, publishWorld, publishDraft, editWorld } from '@/utils/world-helpers';
// UI
import { Disclosure } from '@headlessui/react';
import { AccordionIcon } from '@/components/icon/icon';
import TextInput from '@/components/ui/input/InputTextField';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import AutocompleteBox from '@/components/ui/input/AutoCompleteBar';
import { TagsBar } from '@/components/ui/display/tags-display-helpers';
import DescriptionSections from './description/DescriptionSections';
import SettingGroup from '@/components/ui/button/toggle/SettingGroup';
import OriginSwitchTab from './OriginSwitchTab';
import { LoadingOverlay } from '@/components/ui/widget/loading';
import { ImagesUpload } from '@/components/ui/image/ImagesUpload';
import { PopupDialog } from '@/components/ui/input/PopupDialog';
import WorldDisplay from '@/components/ui/display/World/WorldDisplay';


export default function CaW() {
    const { currentDraft, fetchDrafts } = useDraftContext();
    const { user } = useSupabase()
    const router = useRouter()
    const [isReviewOpen, setIsReviewOpen] = useState(false)

    const formikRef = useRef<FormikProps<WorldPayload> | null>(null); // Adding a ref to Formik
    useEffect(() => {
        if (formikRef.current) {
            const newValues: WorldPayload = "default" in currentDraft ? EmptyWorldPayload : cast_to_worldpayload(currentDraft)
            formikRef.current.resetForm({ values: newValues });
        }
    }, [currentDraft])  // Resetting the form whenever currentDraft changes

    if (!user) {
        return <>Loading...</>;
    }

    const submitWorld = async (values: WorldPayload, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true)
        try {
            if ("default" in currentDraft)
                await publishWorld(values, currentDraft.id, user.id)
            else if (!currentDraft.is_public) {
                await overwriteDraft(values, currentDraft.id)
                await publishDraft(currentDraft.id)
            } else {
                await editWorld(values, currentDraft.id)
            }
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        } finally {
            setSubmitting(false)
            router.push(`/world/${currentDraft.id}`); // Redirect to world page
        }
    }

    const handleSaveNewDraft = async (values: WorldPayload, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true)
        try {
            await saveNewDraft(values, currentDraft.id, user.id)
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        } finally {
            fetchDrafts();
            setSubmitting(false)
            router.refresh();
        }
    }

    const handleOverwriteDraft = async (values: WorldPayload, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true)
        try {
            await overwriteDraft(values, currentDraft.id)
        } catch (error) {
            alert(`Error: ${JSON.stringify(error)}`);
        } finally {
            fetchDrafts();
            setSubmitting(false)
            router.refresh();
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && (event.target as HTMLElement).nodeName !== 'TEXTAREA') {
            event.preventDefault();
        }
    };

    return (
        <Formik
            initialValues={EmptyWorldPayload}
            onSubmit={() => { }}
            innerRef={formikRef}
        >
            {({ isSubmitting, isValid, values, errors, touched, setValues, resetForm, setFieldValue, setErrors, setSubmitting }) => (
                <Form className='flex flex-col space-y-6 items-start' onKeyDown={handleKeyDown}>
                    <div id="origin-group" className='w-full flex flex-col space-y-2'>
                        <FieldTitleDisplay label={'origin'} />
                        <OriginSwitchTab />
                    </div>

                    <div id="title-group" className='w-full flex flex-col space-y-2'>
                        <FieldTitleDisplay label={"title"} />
                        <TextInput name={"title"} placeholder={"Add your title..."} textSize={"text-4xl"} multiline={1} />
                    </div>

                    <div id="images-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={'covers'} />
                        <ImagesUpload
                            dimension={{ height: "h-80", width: "w-80" }}
                            bucket={"world"}
                            folder={`${currentDraft.id}/`}
                            initPaths={values.images}
                            setValues={(paths) => setFieldValue('images', paths)}
                            maxNum={7}
                        />
                    </div>

                    <div id="logline-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"logline"} />
                        <TextInput name={"logline"} placeholder={"Add your logline..."} textSize={"text-base"} multiline={4} />
                    </div>

                    <div id="tags-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"tags"} />
                        <AutocompleteBox
                            value={values.tags}
                            setFieldValue={setFieldValue}
                        />
                        <TagsBar tags={values.tags} setFieldValue={setFieldValue} />
                    </div>

                    <div id="description-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"description"} />
                        <DescriptionSections formSections={values.description} setFieldValue={setFieldValue} />
                    </div>

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
                                    <Disclosure.Panel as={SettingGroup} settings={values.settings} asks={WorldSettingsAsks} setFieldValue={setFieldValue} />
                                </>
                            )}
                        </Disclosure>
                    </div>

                    <div id="submit-group" className='my-4 md:my-8 mx-auto w-full md:w-2/3 flex flex-col space-y-3'>
                        <button className="w-full p-3 primaryButton text-2xl" onClick={() => { console.log(values); setIsReviewOpen(true) }} type="button">
                            Review & Publish
                        </button>
                        {'default' in currentDraft ? (
                            <button className="w-full p-2 secondaryButton text-lg" onClick={() => handleSaveNewDraft(values, setSubmitting)} type="button">
                                Save as New Draft
                            </button>) : (
                            currentDraft.is_public ?
                                <Link href={`/world/${currentDraft.id}`} >
                                    <button className="w-full p-2 secondaryButton text-lg" type="button">
                                        Cancel
                                    </button>
                                </Link> :
                                <button className="w-full p-2 secondaryButton text-lg" onClick={() => handleOverwriteDraft(values, setSubmitting)} type="button">
                                    Overwrite Draft
                                </button>
                        )}
                    </div>

                    {isSubmitting && <LoadingOverlay />}

                    <PopupDialog
                        isOpen={isReviewOpen}
                        setIsOpen={setIsReviewOpen}
                        dialogTitle='Are you sure you want to publish this world?'
                        dialogContent=''
                        initInputValue={<WorldDisplay world={cast_to_world(values, user.id)} preview={true} />}
                        confirmAction={() => submitWorld(values, setSubmitting)}
                        dialogType='display'
                    />

                </Form>
            )}

        </Formik>

    );
}
