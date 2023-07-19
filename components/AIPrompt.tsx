'use client'
import { Formik, Field, Form, ErrorMessage, FieldProps } from 'formik';
import { RiAiGenerate } from 'react-icons/ri'
import TextInput from '@/components/ui/input/TextInput';
import { FieldTitleDisplay } from '@/components/ui/display/displays';
import AutocompleteBox from '@/components/ui/input/AutoCompleteBar';
import { TagsBar } from '@/components/ui/button/TagsBar';
import useStreamText from './useStreamText';

const initValues = {
    prompt: '',
    tags: [] as string[]
}

export default function AIPrompt({ worldId }: { worldId: string }) {
    const { lines, isLoading, streamText } = useStreamText();

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    const handleSubmit = (values: any) => {

    }

    const handleGenerate = async (values: any) => {
        const inputBody = {
            prompt: values.prompt,
            worldId: worldId
        }
        await streamText(inputBody, 'api/generate/piece')
            .then()
            .catch((error: Error) => {
                console.log(error.message);
            });
    }

    return (
        <Formik
            initialValues={initValues}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, isValid, values, errors, touched, setFieldValue, setErrors }) => (
                <Form className='flex flex-col space-y-6 items-start' onKeyDown={handleKeyDown}>
                    <div id="title-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"prompt"} />
                        <TextInput name={"prompt"} placeholder={"This is the one-line prompt..."} textSize={"text-2xl"} multiline={4} bold={"font-bold"} />
                    </div>

                    <div id="tags-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"tags"} />
                        <AutocompleteBox
                            value={values.tags}
                            setFieldValue={setFieldValue}
                        />
                        <TagsBar tags={values.tags} setFieldValue={setFieldValue} />
                    </div>

                    <div id="content-group" className='w-full flex flex-col'>
                        <div className='flex flex-row items-center space-x-2'>
                            <FieldTitleDisplay label={"content"} />
                            <RiAiGenerate className='text-foreground/50' onClick={() => handleGenerate(values)} />
                        </div>
                        <div className='border rounded-ml w-full h-96 overflow-scroll font-serif text-sm'>
                            {lines.map((line, index) => (
                                <p key={index} className='leading-loose font-sans text-base'>{line}</p>
                            ))}
                        </div>

                    </div>

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
    )
}