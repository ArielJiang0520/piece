'use client'
// create-a-world
import { Formik, Field, FormikProps, Form, ErrorMessage, FieldProps } from 'formik';
import { useEffect, useRef } from 'react';
import TextInput from '@/components/ui/input/InputText';
import { FieldTitleDisplay } from '@/components/ui/display/displays';
import AutocompleteBox from '@/components/ui/input/AutoCompleteBar';
import { TagsBar } from '@/components/ui/button/TagsBar';
import DescriptionSections from '@/components/ui/description/DescriptionSections';
import SettingGroup from '@/components/ui/button/SettingGroup';
import OriginSwitchTab from '@/components/ui/switch-tab/OriginSwitchTab';

import { postData, } from '@/utils/helpers';
import { WorldPayload, WorldSettingsAsks, EmptyWorldPayload } from '@/types/types.world';

interface CaWFormProps {
    currentDraft: null | WorldPayload
}

export default function CaW({ currentDraft }: CaWFormProps) {

    console.log('CaW', currentDraft)

    const initValues = currentDraft ? currentDraft : EmptyWorldPayload
    const formikRef = useRef<FormikProps<WorldPayload> | null>(null); // Adding a ref to Formik

    useEffect(() => {
        formikRef.current && formikRef.current.resetForm({ values: initValues })
    }, [currentDraft])  // Resetting the form whenever currentDraft changes


    const handleSubmit = async (values: WorldPayload) => {
        console.log('form submitted', values)
        try {
            const response = await postData({
                url: '/api/create-a-world',
                data: values
            });
            console.log('Response:', response);
        } catch (error) {
            console.error('Error:', (error as Error).message);
        }
    }

    const handleSaveDraft = async (values: WorldPayload) => {
        console.log('form saved as new draft', values)
        try {
            const response = await postData({
                url: '/api/create-a-world/draft',
                data: values
            });
            console.log('Response:', response);
        } catch (error) {
            console.error('Error:', (error as Error).message);
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    return (

        <Formik
            initialValues={initValues}
            onSubmit={handleSubmit}
            innerRef={formikRef}
        >
            {({ isSubmitting, isValid, values, errors, touched, setValues, resetForm, setFieldValue, setErrors }) => (
                <Form className='flex flex-col space-y-6 items-start' onKeyDown={handleKeyDown}>


                    <div id="origin-group" className='w-full md:w-1/2 flex flex-col'>
                        <FieldTitleDisplay label={'❇️origin'} />
                        <OriginSwitchTab />
                    </div>

                    <div id="title-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"🖋️title"} />
                        <TextInput name={"title"} placeholder={"My World..."} textSize={"text-4xl"} multiline={1} />
                    </div>

                    <div id="logline-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"✨logline"} />
                        <TextInput name={"logline"} placeholder={"My World..."} textSize={"text-base"} multiline={2} />
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
                        <FieldTitleDisplay label={"🔧settings"} />
                        <SettingGroup settings={values.settings} asks={WorldSettingsAsks} setFieldValue={setFieldValue} />
                    </div>

                    <div id="submit-group" className='mx-auto w-full lg:w-2/3 flex flex-col space-y-3'>
                        <button className="w-full p-3 primaryButton text-2xl" type="submit">
                            Review & Publish
                        </button>
                        <button className="w-full p-2 secondaryButton text-lg" onClick={() => handleSaveDraft(values)} type="button">
                            Save as Draft
                        </button>
                    </div>
                </Form>
            )}
        </Formik>

    );
}
