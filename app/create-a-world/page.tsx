'use client'
// create-a-world
import { Formik, Field, Form, ErrorMessage, FieldProps } from 'formik';
import TextInput from '@/components/ui/input/InputText';
import { FieldTitleDisplay } from '@/components/ui/display/displays';
import AutocompleteBox from '@/components/ui/input/AutoCompleteBar';
import { TagsBar } from '@/components/ui/button/TagsBar';
import DescriptionSections from '@/components/ui/description/DescriptionSections';
import SettingGroup from '@/components/ui/button/SettingGroup';
import { postData, renameKeyInObjectsArray, formatTimestamp } from '@/utils/helpers';
import { WorldPayload, initValues, emptyValues, WorldSettingsAsks, cast_to_worldpayload } from '@/types/types.world';
import OriginSwitchTab from '@/components/ui/switch-tab/OriginSwitchTab';
import InputList from '@/components/ui/input/InputBox';
import { useSupabase } from '@/app/supabase-provider';
import { useEffect, useState } from 'react'

// Move the load draft part up, so we can also edit as well
// Add field which links other posts or worlds

export default function Page() {
    const { supabase } = useSupabase()
    const [userDrafts, setUserDrafts] = useState([] as any[])
    const [currentDraft, setCurrentDraft] = useState(null)

    useEffect(() => {
        const fetchUserDrafts = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                console.error('did not find authenticated user')
                return
            }

            const { data, error } = await supabase
                .from('drafts')
                .select()
                .eq('creator_id', user.id)

            if (error) {
                console.error(error.code, error.message)
                return
            }
            setUserDrafts(data)
        }
        fetchUserDrafts()
    }, [])

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

    const handleOnDraftChange = (draft: any) => {

    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    return (
        <div className="w-full md:w-2/3 flex flex-col gap-14 px-5 py-5 lg:py-5 text-foreground font-mono">
            <Formik
                initialValues={!currentDraft ? emptyValues : currentDraft}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, isValid, values, errors, touched, setValues, resetForm, setFieldValue, setErrors }) => (
                    <Form className='flex flex-col space-y-6 items-start' onKeyDown={handleKeyDown}>
                        <div id="draft-group" className='w-full flex flex-col items-end'>
                            <FieldTitleDisplay label={'load draft'} textSize={'text-xs'} />
                            <InputList
                                data={userDrafts}
                                width='w-64'
                                nameKey="world_name"
                                display_func={(item: any) => item.id === "default" ? `${item.name}` : `${formatTimestamp(item.modified_at)} - ${item.world_name}`}
                                handleOnChange={(selectedOption) => {
                                    if (selectedOption.id === 'default') {
                                        resetForm();
                                    } else {
                                        setValues(cast_to_worldpayload(selectedOption));
                                        console.log(selectedOption, cast_to_worldpayload(selectedOption))
                                        setCurrentDraft(selectedOption)
                                    }
                                }}
                            />
                        </div>

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
        </div>
    );
}
