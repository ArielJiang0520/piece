'use client'
// create-a-world
import { Formik, Field, Form, ErrorMessage, FieldProps } from 'formik';
import TextInput from '@/components/ui/input/TextInput';
import { FieldTitleDisplay } from '@/components/ui/display/displays';
import AutocompleteBox from '@/components/ui/input/AutoCompleteBar';
import { TagsBar } from '@/components/ui/button/TagsBar';
import DescriptionSections from '@/components/ui/description/DescriptionSections';
import SettingGroup from '@/components/ui/button/SettingGroup';
import { postData } from '@/utils/helpers';
import { WorldPayload, initValues, WorldSettingsAsks } from '@/types/types.world';
import { MyRadioGroup } from '@/components/ui/button/RadioButton';

export default function Page() {
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
            alert((error as Error).message);
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    return (
        <div className="w-full md:w-2/3 flex flex-col gap-14 px-5 py-16 lg:py-24 text-foreground font-mono">
            <Formik
                initialValues={initValues}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, isValid, values, errors, touched, setFieldValue, setErrors }) => (
                    <Form className='flex flex-col space-y-6 items-start' onKeyDown={handleKeyDown}>
                        {/* <div>
                            <InputTitle label={'origin'} />
                            <MyRadioGroup />
                        </div> */}

                        <div id="title-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"title"} />
                            <TextInput name={"title"} placeholder={"My World..."} textSize={"text-4xl"} multiline={1} />
                        </div>

                        <div id="logline-group" className='w-full flex flex-col'>
                            <FieldTitleDisplay label={"logline"} />
                            <TextInput name={"logline"} placeholder={"My World..."} textSize={"text-base"} multiline={2} />
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
                            <FieldTitleDisplay label={"privacy settings"} />
                            <SettingGroup settings={values.settings} asks={WorldSettingsAsks} setFieldValue={setFieldValue} />
                        </div>

                        <div className='h-40 block'></div>
                        <div id="submit-group" className='mx-auto w-full lg:w-2/3 flex flex-col space-y-3'>
                            <button className="w-full p-3 primaryButton text-2xl" type="submit">
                                Review & Publish
                            </button>
                            <button className="w-full p-2 secondaryButton text-lg" type="submit">
                                Save as Draft
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
