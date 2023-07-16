'use client'
// create-a-world
import { Formik, Field, Form, ErrorMessage, FieldProps } from 'formik';

import TextInput from '@/components/ui/input/TextInput';
import { InputTitle } from '@/components/ui/display/Title';
import AutocompleteBox from '@/components/ui/input/AutoCompleteBar';
import TagsBar from '@/components/ui/button/TagsBar';
import DescriptionSections from '@/components/ui/description/DescriptionSections';
import SettingGroup from '@/components/ui/display/SettingGroup';

import { WorldPayload, WorldSettingsAsks } from '@/types/types.world';


const initValues: WorldPayload = {
    title: 'Silicon Valley Psychos',
    logline: `The resilient yet financially struggling Linus, grappling with his uncompromising principles against corporate greed,  was faced with an offer from Wynn - the man who once betrayed him`,
    tags: ["BL", "Tech", "Power Dynamics"],
    description: [
        {
            sectionTitle: "Backdrop",
            sectionCards: []
        },
        {
            sectionTitle: "Characters",
            sectionCards: [
                {
                    cardTitle: 'Linus',
                    cardContent: `Background: High school computer science teacher in a Fremont suburb, co-founder of WinLin, and a Stanford graduate. Previously a tech entrepreneur, he chose a simpler life due to disillusionment with corporate greed.
Appearance: Medium height with unkempt dark curly hair, big eyes, and an often rugged appearance due to his simple and functional clothing. But underneath his scruffiness is a cute face and a pale, fragile yet appealing body
Personality: Intellectually curious, introverted, genuine, and dedicated, with a strong ethical stand against commercial exploitation of knowledge and technology. Has a tendency to suppress emotions and desires and play coy
`
                }
            ]
        },
        {
            sectionTitle: "Story Premise",
            sectionCards: []
        }
    ],
    coverImage: '',
    settings: {
        NSFW: false,
        allowContribution: true,
        allowSuggestion: true,
    }
}

export default function Page() {

    const handleSubmit = async (values: WorldPayload) => {
        console.log('form submitted', values)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    return (
        <div className="w-full md:w-2/3 flex flex-col gap-14 px-5 py-16 lg:py-24 text-foreground">
            <Formik
                initialValues={initValues}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, isValid, values, errors, touched, setFieldValue, setErrors }) => (
                    <Form className='flex flex-col space-y-6 items-start' onKeyDown={handleKeyDown}>

                        <div id="title-group" className='w-full flex flex-col'>
                            <InputTitle label={"title"} />
                            <TextInput name={"title"} placeholder={"My World..."} textSize={"text-4xl"} multiline={1} />
                        </div>

                        <div id="logline-group" className='w-full flex flex-col'>
                            <InputTitle label={"logline"} />
                            <TextInput name={"logline"} placeholder={"My World..."} textSize={"text-base"} multiline={2} />
                        </div>

                        <div id="tags-group" className='w-full flex flex-col'>
                            <InputTitle label={"tags"} />
                            <AutocompleteBox
                                value={values.tags}
                                setFieldValue={setFieldValue}
                            />
                            <TagsBar tags={values.tags} setFieldValue={setFieldValue} />
                        </div>

                        <div id="description-group" className='w-full flex flex-col'>
                            <InputTitle label={"description"} />
                            <DescriptionSections formSections={values.description} setFieldValue={setFieldValue} />
                        </div>

                        <div id="settings-group" className='w-full flex flex-col'>
                            <InputTitle label={"privacy settings"} />
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
