'use client'
// create-a-world
import { useEffect, useRef } from 'react';
import { useDraftContext } from './draft-provider';
import { useRouter } from 'next/navigation';
import { WorldPayload, WorldSettingsAsks, EmptyWorldPayload, cast_to_worldpayload } from '@/types/types.world';
import { postData, updateData } from '@/utils/helpers';
import { Formik, Field, FormikHelpers, FormikProps, Form, ErrorMessage, FieldProps } from 'formik';
// UI
import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import TextInput from '@/components/ui/input/InputText';
import { FieldTitleDisplay } from '@/components/ui/display/displays';
import AutocompleteBox from '@/components/ui/input/AutoCompleteBar';
import { TagsBar } from '@/components/ui/button/TagsBar';
import DescriptionSections from '@/components/ui/description/DescriptionSections';
import SettingGroup from '@/components/ui/button/SettingGroup';
import OriginSwitchTab from '@/components/ui/switch-tab/OriginSwitchTab';
import { LoadingOverlay } from '@/components/ui/widget/loading';


export default function CaW() {
    const router = useRouter()
    const { currentDraft, updateDrafts } = useDraftContext();

    const formikRef = useRef<FormikProps<WorldPayload> | null>(null); // Adding a ref to Formik

    useEffect(() => {
        if (formikRef.current) {
            const newValues: WorldPayload = currentDraft ? cast_to_worldpayload(currentDraft) : EmptyWorldPayload
            formikRef.current.resetForm({ values: newValues });
        }
    }, [currentDraft])  // Resetting the form whenever currentDraft changes


    const handleSubmit = async (values: WorldPayload, actions: FormikHelpers<WorldPayload>) => {
        console.log('form submitted', values)
        actions.setSubmitting(true)
        try {
            const response = await postData({
                url: '/api/create-a-world',
                data: values
            });
            console.log('Response:', response);
        } catch (error) {
            console.error('Error:', (error as Error).message);
        }
        actions.setSubmitting(false)
    }

    const handleSaveDraft = async (values: WorldPayload, setSubmitting: (isSubmitting: boolean) => void) => {
        console.log('form saved as new draft', values)
        setSubmitting(true)
        try {
            if (currentDraft)
                throw Error('Should not save new a draft when currentDraft is set')
            const response = await postData({
                url: '/api/create-a-world/draft',
                data: values
            });
            console.log('Response:', response);
        } catch (error) {
            console.error('Error:', (error as Error).message);
        }
        updateDrafts();

        setSubmitting(false)
        router.refresh();
    }

    const handleOverwriteDraft = async (values: WorldPayload, setSubmitting: (isSubmitting: boolean) => void) => {
        console.log('form overwrite draft', values)
        setSubmitting(true)
        try {
            if (!currentDraft)
                throw Error('No draft id found, can not update draft')
            const response = await updateData({
                url: '/api/create-a-world/draft',
                data: values,
                id: currentDraft.id
            });
            console.log('Response:', response);
        } catch (error) {
            console.error('Error:', (error as Error).message);
        }
        updateDrafts();
        setSubmitting(false)
        router.refresh();
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

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
                        <Disclosure as="div">
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

                    <div id="submit-group" className='my-4 mx-auto w-full lg:w-2/3 flex flex-col space-y-3'>
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
                </Form>
            )}
        </Formik>

    );
}
