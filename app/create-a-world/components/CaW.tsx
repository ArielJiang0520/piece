'use client'
// /create-a-world
import { WorldPayload, WorldSettingsAsks, EmptyWorldPayload, cast_to_worldpayload, cast_to_world } from '@/types/types.world';
// Need to handle input error
// Need to add "?" icon for instruction
import { useEffect, useRef, useState } from 'react';
import { useDraftContext } from '../draft-provider';
import { useSupabase } from '@/app/supabase-provider';
import Link from 'next/link';
import { Formik, Field, FormikHelpers, FormikState, FormikProps, Form, ErrorMessage, FieldProps } from 'formik'; // need to validate input
// UI
import TextInput from '@/components/ui/input/InputTextField';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import { TagsBar } from '@/components/ui/input/tags-helpers';
import DescriptionSections from './description/DescriptionSections';
import SettingGroup from '@/components/ui/button/toggle/SettingGroup';
import ChooseAnOrigin from './ChooseAnOrigin';
import { LoadingOverlay } from '@/components/ui/widget/loading';
import { ImagesUpload } from '@/components/ui/image/ImagesUpload';
import { Tab } from '@headlessui/react'
import PublishButton from './PublishButton';
import PreviewButton from './PreviewButton';
import SaveDraftButton from './SaveDraftButton';

export default function CaW() {
    const { currentDraft, fetchDrafts } = useDraftContext();
    const { user } = useSupabase()

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

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && (event.target as HTMLElement).nodeName !== 'TEXTAREA') {
            event.preventDefault();
        }
    };

    const StyledTab = ({ text }: { text: string }) => <Tab className={`flex flex-col space-y-2 outline-none`}>
        <div className='font-mono text-foreground/80 font-semibold ui-selected:text-brand capitalize px-6 whitespace-nowrap'>
            {text}
        </div>
        <div className='hpx border-4 w-full rounded-xl ui-selected:border-brand'>

        </div>
    </Tab>

    const TabPanel = ({ children }: { children: React.ReactNode }) => (
        <Tab.Panel className={`flex flex-col space-y-6 items-start w-full min-h-[600px] py-8`}>
            {children}
        </Tab.Panel>)

    return (
        <Formik
            initialValues={EmptyWorldPayload}
            onSubmit={() => { }}
            innerRef={formikRef}
        >
            {({ isSubmitting, isValid, values, errors, touched, setValues, resetForm, setFieldValue, setErrors, setSubmitting }) => (
                <Form className='' onKeyDown={handleKeyDown}>
                    <Tab.Group>
                        <Tab.List className={`flex flex-row space-x-8 overflow-hidden overflow-x-auto`}>
                            <StyledTab text={`origin & genre`} />
                            <StyledTab text={`basics`} />
                            <StyledTab text={`images`} />
                            <StyledTab text={`description`} />
                            <StyledTab text={`settings`} />
                        </Tab.List>
                        <Tab.Panels >
                            <TabPanel>
                                <div id="origin-group" className='w-full flex flex-col space-y-2'>
                                    <FieldTitleDisplay label={'origin'} />
                                    <ChooseAnOrigin />
                                </div>

                                <div id="genre-group" className='w-full flex flex-col'>
                                    <FieldTitleDisplay label={"genre"} />
                                </div>

                            </TabPanel>
                            <TabPanel>
                                <div id="title-group" className='w-full flex flex-col space-y-2'>
                                    <FieldTitleDisplay label={"title"} />
                                    <TextInput name={"title"} placeholder={"Add your title"} textSize={"text-lg"} multiline={1} />
                                </div>

                                <div id="logline-group" className='w-full flex flex-col'>
                                    <FieldTitleDisplay label={"logline"} />
                                    <TextInput name={"logline"} placeholder={"A few lines about your world"} textSize={"text-lg"} multiline={4} />
                                </div>

                                <div id="tags-group" className='w-full flex flex-col'>
                                    <FieldTitleDisplay label={"Characters"} />
                                    <TagsBar values={values.tags} field={"tags"} setFieldValue={setFieldValue} />
                                </div>

                                <div id="tags-group" className='w-full flex flex-col'>
                                    <FieldTitleDisplay label={"tags"} />
                                    <TagsBar values={values.tags} field={"tags"} setFieldValue={setFieldValue} />
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div id="images-group" className='w-full flex flex-col'>
                                    <FieldTitleDisplay label={"Upload your cover images"} />
                                    <ImagesUpload
                                        dimension={{ height: "h-80", width: "w-80" }}
                                        bucket={"world"}
                                        folder={``}
                                        initPaths={values.images}
                                        setValues={(paths) => setFieldValue('images', paths)}
                                        maxNum={7}
                                    />
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div id="description-group" className='w-full flex flex-col'>
                                    <DescriptionSections formSections={values.description} setFieldValue={setFieldValue} />
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div id="settings-group" className='w-full flex flex-col'>
                                    <SettingGroup settings={values.settings} asks={WorldSettingsAsks} setFieldValue={setFieldValue} />
                                </div>
                            </TabPanel>
                        </Tab.Panels>
                    </Tab.Group>

                    <div id="submit-group" className='flex flex-col w-full items-center justify-center space-y-3'>
                        <div className='w-full max-w-lg flex flex-row items-center space-x-1'>
                            <div className='flex-grow h-10'>
                                <PublishButton uid={user.id} values={values} currentDraft={currentDraft} setSubmitting={setSubmitting} />
                            </div>
                            <div className='w-10 h-10'>
                                <PreviewButton uid={user.id} values={values} />
                            </div>
                        </div>
                        <div className='w-full max-w-lg flex flex-row items-center justify-center space-x-4'>
                            <SaveDraftButton uid={user.id} values={values} currentDraft={currentDraft} setSubmitting={setSubmitting} fetchDrafts={fetchDrafts} />
                            <Link href={'default' in currentDraft || currentDraft.is_draft ? `/` : `/world/${currentDraft.id}`} >
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

    );
}
