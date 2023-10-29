'use client'
// /create-a-world
import { WorldPayload, WorldSettingsAsks, EmptyWorldPayload, WorldProgress } from '@/types/types';
import { cast_to_worldpayload } from "@/types/cast-types";
// Need to handle input error
import { useEffect, useRef, useState } from 'react';

import { useSupabase } from '@/app/supabase-provider';
import Link from 'next/link';
import { Formik, Field, FormikHelpers, FormikState, FormikProps, Form, ErrorMessage, FieldProps } from 'formik'; // need to validate input
// UI
import { HelpTooltip } from '@/components/ui/widget/tooltip';
import { TextInput } from '@/components/ui/input/InputTextField';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import DescriptionSections from '../description/DescriptionSections';
import SettingGroup from '@/components/ui/button/toggle/SettingGroup';
import { LoadingOverlay } from '@/components/ui/widget/loading';
import { ImagesUpload } from '@/components/ui/image/ImagesUpload';
import { Tab } from '@headlessui/react'

// local import
import { useDraftContext } from '../../draft-provider';
import PublishButton from '../buttons/PublishButton';
import PreviewButton from '../buttons/PreviewButton';
import SaveDraftButton from '../buttons/SaveDraftButton';
import ChooseTags from './ChooseTags';
import ChooseGenres from './ChooseGenres';
import DropDownSelector from '@/components/ui/input/DropDownSelector';
import { capitalize } from '@/utils/helpers';

export default function CaW() {
    const { currentDraft, fetchDrafts } = useDraftContext();
    const { user } = useSupabase()

    const formikRef = useRef<FormikProps<WorldPayload> | null>(null); // Adding a ref to Formik
    const [isFormikRendered, setIsFormikRendered] = useState(false);

    // Add effect to change state when Formik has been rendered
    useEffect(() => {
        if (formikRef.current) {
            setIsFormikRendered(true);
        }
    }, [formikRef]);

    useEffect(() => {
        if (isFormikRendered) {
            const newValues: WorldPayload = "default" in currentDraft ? EmptyWorldPayload : cast_to_worldpayload(currentDraft)
            formikRef.current?.resetForm({ values: newValues });
        }
    }, [isFormikRendered, currentDraft])  // Resetting the form whenever currentDraft changes

    if (!user) {
        return <>You can not create a world while logged out.</>;
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
        <div className='hpx border-4 w-full rounded-xl ui-selected:border-brand' />
    </Tab>

    const TabPanel = ({ children }: { children: React.ReactNode }) => (
        <Tab.Panel className={`flex flex-col space-y-6 items-start w-full min-h-[600px] py-8`}>
            {children}
        </Tab.Panel>
    )

    return (
        <Formik
            initialValues={EmptyWorldPayload}
            onSubmit={() => { }}
            innerRef={(instance) => {
                formikRef.current = instance;
                setIsFormikRendered(true);
            }}
        >
            {({ isSubmitting, isValid, values, errors, touched, setValues, resetForm, setFieldValue, setErrors, setSubmitting }) => (
                <Form className='' onKeyDown={handleKeyDown}>
                    <Tab.Group>
                        <Tab.List className={`flex flex-row space-x-8 overflow-hidden overflow-x-auto`}>
                            <StyledTab text={`basics`} />
                            <StyledTab text={`images`} />
                            <StyledTab text={`details`} />
                            <StyledTab text={`settings`} />
                        </Tab.List>

                        <Tab.Panels >
                            <TabPanel>
                                <div id="title-group" className='w-full flex flex-col'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <FieldTitleDisplay label={"title"} />
                                        {/* <HelpTooltip tooltipText='Add your title here' /> */}
                                    </div>
                                    <TextInput name={"name"} placeholder={"Add the title of your world"} textSize={"text-xl"} multiline={1} />
                                </div>

                                <div id="logline-group" className='w-full flex flex-col'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <FieldTitleDisplay label={"summary"} />
                                        {/* <HelpTooltip tooltipText='Add your title here' /> */}
                                    </div>
                                    <TextInput name={"logline"}
                                        placeholder={"Add a few lines about your world"}
                                        textSize={"text-base"} multiline={4}
                                    />
                                </div>

                                <div id="genre-group" className='w-full max-w-2xl flex-col space-y-2'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <FieldTitleDisplay label={"genres"} />
                                        <HelpTooltip tooltipText='Add your title here' />
                                    </div>
                                    <ChooseGenres />
                                </div>

                                <div id="tags-group" className='w-full max-w-2xl flex-col space-y-2'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <FieldTitleDisplay label={"elements"} />
                                        <HelpTooltip tooltipText='Add your title here' />
                                    </div>
                                    <ChooseTags />
                                </div>

                            </TabPanel>

                            <TabPanel>
                                <div id="images-group" className='w-full flex flex-col'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <FieldTitleDisplay label={"cover images"} />
                                        <HelpTooltip tooltipText='Add your title here' />
                                    </div>
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
                                <div id="settings-group" className='w-full flex flex-col space-y-4'>
                                    <div>
                                        <FieldTitleDisplay label={"Progress"} />
                                        <DropDownSelector
                                            data={WorldProgress}
                                            selected={WorldProgress.find(pro => pro.id === values.progress)!}
                                            setSelected={(progress) => setFieldValue('progress', progress.id)}
                                            width='w-80'
                                            nameKey='name'
                                        />
                                    </div>
                                    <div>
                                        <FieldTitleDisplay label={"Privacy"} />
                                        <SettingGroup settings={values.settings} asks={WorldSettingsAsks} setFieldValue={setFieldValue} />
                                    </div>
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
                            <Link href={'default' in currentDraft || currentDraft.is_draft ? `/` : `/worlds/${currentDraft.id}`} >
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
