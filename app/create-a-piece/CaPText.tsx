'use client'
import { Formik, Field, Form, ErrorMessage, FieldProps } from 'formik';
import { AIGenerateIcon, BookIcon, EyeIcon } from '@/components/icon/icon';
import TextInput from '@/components/ui/input/InputText';
import { FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import AutocompleteBox from '@/components/ui/input/AutoCompleteBar';
import { TagsBar } from '@/components/ui/display/tags-display-helpers';
import useStreamText from '../../utils/useStreamText';
import { usePieceContext } from './piece-provider';
import WorldDisplay from '@/components/ui/display/WorldDisplay';
import { InputDialog } from '@/components/ui/input/InputDialog';
import { useState } from 'react';

export default function CaPText() {
    const { world } = usePieceContext();
    const { lines, isLoading, streamText } = useStreamText();
    const [isReviewOpen, setIsReviewOpen] = useState(false)

    if (!world)
        return <>Loading...</>

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && (event.target as HTMLElement).nodeName !== 'TEXTAREA') {
            event.preventDefault();
        }
    };


    const handleSubmit = (values: any) => {

    }

    const handleGenerate = async (values: any) => {
        const inputBody = {
            prompt: values.prompt,
            worldId: world.id
        }
        await streamText(inputBody, 'api/generate/piece')
            .then()
            .catch((error: Error) => {
                console.log(error.message);
            });
    }

    return (
        <Formik
            initialValues={{ title: '', tags: [], content: '' }}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, isValid, values, errors, touched, setFieldValue, setErrors }) => (
                <Form className='flex flex-col space-y-6 items-start' onKeyDown={handleKeyDown}>
                    <div id="view-group" className='w-full flex flex-row justify-end items-center text-foreground/50 '>
                        <button type="button" className='flex flex-row items-center py-1 px-2 border rounded-lg space-x-1' onClick={() => setIsReviewOpen(true)}>
                            <EyeIcon className='h-3 w-3' />
                            <FieldTitleDisplay label={"Peek the world"} textSize='text-xs' />
                        </button>
                    </div>
                    <div id="title-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"title"} />
                        <TextInput name={"title"} placeholder={"Write your catchy one-liner..."} textSize={"text-lg"} multiline={2} bold={"font-bold"} />
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
                            {/* <AIGenerateIcon className='text-foreground/50' onClick={() => handleGenerate(values)} /> */}
                        </div>
                        <TextInput name={"content"} placeholder={"Your content..."} textSize={"text-sm"} multiline={25} bold={"font-medium"} />
                        {/*                     
                        <textarea className='border rounded-ml w-full h-96 overflow-scroll font-serif text-sm'>
                            {lines.map((line, index) => (
                                <p key={index} className='leading-loose font-sans text-base'>{line}</p>
                            ))}
                        </textarea> */}

                    </div>

                    <div id="submit-group" className='mx-auto w-full lg:w-2/3 flex flex-col space-y-3'>
                        <button className="w-full p-3 primaryButton text-2xl" type="submit">
                            Review & Publish
                        </button>
                    </div>

                    <InputDialog
                        isOpen={isReviewOpen}
                        setIsOpen={setIsReviewOpen}
                        dialogTitle='Reviewing World'
                        dialogContent=''
                        initInputValue={<WorldDisplay world={world} preview={true} />}
                        confirmAction={() => setIsReviewOpen(false)}
                        dialogType='display'
                        overwriteConfirm='Close'
                        hideCancel={true}
                    />
                </Form>
            )}
        </Formik>
    )
}