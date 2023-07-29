'use client'
// create-a-world
// Need to handle input error
// Need to add "?" icon for instruction
import { useEffect, useRef, useState } from 'react';
import { useDraftContext } from '../draft-provider';
import { useRouter } from 'next/navigation';
import { WorldPayload, WorldSettingsAsks, EmptyWorldPayload, cast_to_worldpayload, cast_to_world, World, WorldDescriptionSection, WorldDescriptionSectionCard } from '@/types/types.world';
import { postData, updateData } from '@/utils/helpers';
import { Formik, Field, FormikHelpers, FormikState, FormikProps, Form, ErrorMessage, FieldProps } from 'formik'; // need to validate input
// UI
import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import TextInput from '@/components/ui/input/InputText';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import AutocompleteBox from '@/components/ui/input/AutoCompleteBar';
import { TagsBar } from '@/components/ui/display/tags-display-helpers';
import DescriptionSections from './description/DescriptionSections';
import SettingGroup from '@/components/ui/button/toggle/SettingGroup';
import OriginSwitchTab from './OriginSwitchTab';
import { LoadingOverlay } from '@/components/ui/widget/loading';
import ImagesUpload from './ImagesUpload';
import { useSupabase } from '@/app/supabase-provider';
import type { User } from '@supabase/supabase-js';
import { InputDialog } from '@/components/ui/input/InputDialog';
import WorldDisplay from '@/components/ui/display/WorldDisplay';
import { copyImages } from '@/utils/image-helpers';

export default function CaW() {
    const { currentDraft, updateDrafts, handleDraftDelete } = useDraftContext();

    const router = useRouter()
    const [isReviewOpen, setIsReviewOpen] = useState(false)


    const { supabase } = useSupabase()
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session || !session.user) {
                alert('did not find authenticated user')
            } else {
                setUser(session.user)
            }
        }
        fetchUser()
    }, [])


    const formikRef = useRef<FormikProps<WorldPayload> | null>(null); // Adding a ref to Formik
    useEffect(() => {
        if (formikRef.current) {
            const newValues: WorldPayload = currentDraft ? cast_to_worldpayload(currentDraft) : EmptyWorldPayload
            formikRef.current.resetForm({ values: newValues });
        }
    }, [currentDraft])  // Resetting the form whenever currentDraft changes

    if (!user) {
        return <>Loading...</>;
    }

    const moveSectionImages = async (bucket_name: string, folder_name: string, sections: WorldDescriptionSection[]) => {
        const newSections: WorldDescriptionSection[] = []
        let newImages: string[] = []

        for (let description of sections) {
            // Copying the section and its cards
            let newDescription: WorldDescriptionSection = {
                ...description,
                sectionCards: []
            }

            for (let card of description.sectionCards) {
                let newPaths: string[] = await copyImages(bucket_name, folder_name, user.id, card.cardImages)
                newImages = [...newImages, ...newPaths]
                // Create a new card object, copying old card fields and replacing cardImages with newPaths
                let newCard: WorldDescriptionSectionCard = {
                    ...card,
                    cardImages: newPaths
                }
                // Add the new card to the copied section's cards array
                newDescription.sectionCards.push(newCard)
            }

            // Add the copied and modified section to newSections
            newSections.push(newDescription)
        }

        return { newSections: newSections, newImages: newImages }
    }


    const submitWorld = async (values: WorldPayload, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true)
        try {
            const newCoverPaths = await copyImages('world', 'published', user.id, values.images)
            const { newSections, newImages } = await moveSectionImages('world', 'published', values.description)
            await postData({
                url: '/api/create-a-world',
                data: {
                    ...values,
                    description: newSections,
                    images: newCoverPaths
                }
            });
            if (currentDraft) {
                // delete currentDraft from draft
                handleDraftDelete(currentDraft)
            }
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        } finally {
            setSubmitting(false)
            router.push(`/`); // Redirect to world page
        }
    }

    const handleSubmit = async (values: WorldPayload, actions: FormikHelpers<WorldPayload>) => {
        setIsReviewOpen(true)
    }

    const handleSaveDraft = async (values: WorldPayload, setSubmitting: (isSubmitting: boolean) => void) => {
        if (currentDraft) {
            alert('Should not save new a draft when currentDraft is set')
            return
        }
        setSubmitting(true)
        try {
            const newCoverPaths = await copyImages('world', 'draft', user.id, values.images)
            const { newSections, newImages } = await moveSectionImages('world', 'draft', values.description)
            await postData({
                url: '/api/create-a-world/draft',
                data: {
                    ...values,
                    images: newCoverPaths,
                    description: newSections
                }
            });
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        } finally {
            updateDrafts();
            setSubmitting(false)
            router.refresh();
        }
    }

    const handleOverwriteDraft = async (values: WorldPayload, setSubmitting: (isSubmitting: boolean) => void) => {
        if (!currentDraft) {
            alert('No draft id found, can not update draft')
            return
        }
        setSubmitting(true)
        try {
            const newCoverPaths = await copyImages('world', 'draft', user.id, values.images)
            const { newSections, newImages } = await moveSectionImages('world', 'draft', values.description)
            await updateData({
                url: '/api/create-a-world/draft',
                data: {
                    ...values,
                    images: newCoverPaths,
                    description: newSections
                },
                id: currentDraft.id
            });

        } catch (error) {
            alert(`Error: ${JSON.stringify(error)}`);
        } finally {
            updateDrafts();
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
            onSubmit={handleSubmit}
            innerRef={formikRef}
        >
            {({ isSubmitting, isValid, values, errors, touched, setValues, resetForm, setFieldValue, setErrors, setSubmitting }) => (
                <Form className='flex flex-col space-y-6 items-start' onKeyDown={handleKeyDown}>
                    <div id="origin-group" className='w-full md:w-1/2 flex flex-col'>
                        <FieldTitleDisplay label={'❇️origin'} />
                        <OriginSwitchTab />
                    </div>

                    <div id="images-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={'🖼️covers'} />
                        <ImagesUpload dimension={{ height: "h-56", width: "w-56" }} initPaths={values.images} setValues={(paths) => setFieldValue('images', paths)} />
                    </div>

                    <div id="title-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"🖋️title"} />
                        <TextInput name={"title"} placeholder={"Add your title..."} textSize={"text-4xl"} multiline={1} />
                    </div>

                    <div id="logline-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"✨logline"} />
                        <TextInput name={"logline"} placeholder={"Add your logline..."} textSize={"text-base"} multiline={2} />
                    </div>

                    <div id="tags-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"🏷️tags"} />
                        <AutocompleteBox
                            value={values.tags}
                            setFieldValue={setFieldValue}
                        />
                        <TagsBar tags={values.tags} setFieldValue={setFieldValue} />
                    </div>

                    <div id="description-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"📜description"} />
                        <DescriptionSections formSections={values.description} setFieldValue={setFieldValue} />
                    </div>

                    <div id="settings-group" className='w-full flex flex-col'>
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <div className='flex flex-row items-center space-x-2'>
                                        <FieldTitleDisplay label={"🔧settings"} />
                                        <Disclosure.Button>
                                            <ChevronRightIcon className={`${open ? 'transform rotate-90' : ''} w-5 h-5`} />
                                        </Disclosure.Button>
                                    </div>
                                    <Disclosure.Panel as={SettingGroup} settings={values.settings} asks={WorldSettingsAsks} setFieldValue={setFieldValue} />
                                </>
                            )}
                        </Disclosure>
                    </div>

                    <div id="submit-group" className='my-4 md:my-8 mx-auto w-full md:w-2/3 flex flex-col space-y-3'>
                        <button className="w-full p-3 primaryButton text-2xl" type="submit">
                            Review & Publish
                        </button>
                        {!currentDraft ?
                            <button className="w-full p-2 secondaryButton text-lg" onClick={() => handleSaveDraft(values, setSubmitting)} type="button">
                                Save as New Draft
                            </button> :
                            <button className="w-full p-2 secondaryButton text-lg" onClick={() => handleOverwriteDraft(values, setSubmitting)} type="button">
                                Overwrite Draft
                            </button>
                        }
                    </div>
                    {isSubmitting && <LoadingOverlay />}
                    <InputDialog
                        isOpen={isReviewOpen}
                        setIsOpen={setIsReviewOpen}
                        dialogTitle='Are you sure you want to publish this world?'
                        dialogContent=''
                        initInputValue={<WorldDisplay world={cast_to_world(values, user?.id as string, new Date().toISOString())} preview={true} />}
                        confirmAction={() => submitWorld(values, setSubmitting)}
                        dialogType='display'
                    />
                </Form>
            )}

        </Formik>

    );
}
