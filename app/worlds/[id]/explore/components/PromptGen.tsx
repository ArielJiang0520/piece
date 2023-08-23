'use client'
import { Formik, Field, FormikProps, Form, ErrorMessage, FieldProps } from 'formik';
import { FieldContentDisplay, FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import { TextInput } from '@/components/ui/input/InputTextField';
import { EmptyPiecePayload, World } from '@/types/types';
import useStreamText from '@/hooks/useStreamText';
import { useState } from 'react';
import PopupDialog from '@/components/ui/input/PopupDialog';
import CaP from '@/app/create-a-piece/components/CaP';

interface PromptPayload {
    prompt: string,
}
export default function PromptGen({ world }: { world: World }) {
    const { lines, isLoading, streamText } = useStreamText();
    const [isPublishWindowOpen, setIsPublishWindowOpen] = useState(false)

    const handleSubmit = async (values: PromptPayload) => {
        const data = {
            prompt: values,
            world: world
        }
        await streamText(data, '/api/generate/piece')
            .then()
            .catch((error: Error) => {
                alert(error.message);
            });
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && (event.target as HTMLElement).nodeName !== 'TEXTAREA') {
            event.preventDefault();
        }
    };

    return <>
        <Formik
            initialValues={{} as PromptPayload}
            onSubmit={(values) => { console.log('submitted values', values); handleSubmit(values) }}
        >
            {({ isSubmitting, isValid, values, errors, touched, setFieldValue, setSubmitting, setErrors }) => (
                <Form className='mt-4 w-full flex flex-col space-y-4 items-start' onKeyDown={handleKeyDown}>

                    <div id="prompt-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"prompt"} />
                        <TextInput name={"prompt"} placeholder={"Add your prompt..."} textSize={"text-lg"} multiline={3} bold={"font-semibold"} />
                    </div>

                    {/* <div id="instruction-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"instruction"} />
                        <TextInput name={"instruction"} placeholder={"Add your instruction..."} textSize={"text-sm"} multiline={4} bold={"font-normal"} />
                    </div> */}

                    <div id="content-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"AI Generated Content"} />
                        <div className='px-4 py-2 my-2 rounded-lg bg-foreground/5 overflow-y-auto cursor-not-allowed' style={{ height: '700px' }}>
                            {lines.map((line, index) => (
                                <p key={index} className='leading-loose font-mono text-sm'>{line}</p>
                            ))}
                        </div>
                    </div>

                    <div className='block h-20'>

                    </div>

                    <div className="fixed bottom-7 left-1/2 transform -translate-x-1/2 flex justify-center space-x-4 z-50">
                        <button className="primaryButton-pink p-2" type="submit">Generate</button>

                        <button className="primaryButton-pink p-2" type="button" onClick={() => setIsPublishWindowOpen(true)}>Publish as New Piece</button>

                    </div>

                    <PopupDialog
                        isOpen={isPublishWindowOpen}
                        setIsOpen={setIsPublishWindowOpen}
                        dialogTitle='Publishing New Piece'
                        dialogContent=''
                        initInputValue={<CaP world={world} initValues={{ ...EmptyPiecePayload, content: lines.join("") }} review={false} />}
                        confirmAction={() => { }}
                        dialogType='display'

                    />



                </Form>
            )}
        </Formik>
    </>
}