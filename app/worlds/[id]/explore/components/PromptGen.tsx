'use client'
import { Formik, Field, FormikProps, Form, ErrorMessage, FieldProps } from 'formik';
import { FieldContentDisplay, FieldTitleDisplay } from '@/components/ui/display/display-helpers';
import { TextInput } from '@/components/ui/input/InputTextField';
import { TypedPiece, World } from '@/types/types';
import useStreamText from '@/hooks/useStreamText';
import { useEffect, useState } from 'react';
import PopupDialog from '@/components/ui/input/PopupDialog';
import { insert_special_piece } from '@/utils/piece-helpers';
import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';
import { notify_error, notify_success } from '@/components/ui/widget/toast';
import Link from 'next/link';
import { LoadingOverlay } from '@/components/ui/widget/loading';

interface PromptPayload {
    prompt: string,
}
export default function PromptGen({ world }: { world: World }) {
    const router = useRouter();
    const { user } = useSupabase()
    const { lines, isLoading, resetLines, streamText } = useStreamText();
    const [isPublishWindowOpen, setIsPublishWindowOpen] = useState(false);

    const [isPublishing, setIsPublishing] = useState(false)

    if (!user) {
        return <>No user found!</>
    }

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
            initialValues={{ prompt: '' } as PromptPayload}
            onSubmit={(values) => handleSubmit(values)}
        >
            {({ isSubmitting, isValid, values, errors, touched, setFieldValue, setSubmitting, setErrors, resetForm }) => (
                <Form className='mt-4 w-full flex flex-col space-y-4 items-start' onKeyDown={handleKeyDown}>

                    <div id="prompt-group" className='w-full flex flex-col'>
                        <FieldTitleDisplay label={"prompt"} />
                        <TextInput name={"prompt"} placeholder={"Add your prompt..."} textSize={"text-lg"} multiline={3} bold={"font-semibold"} />
                    </div>

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

                    <div className="fixed bottom-7 left-1/2 transform -translate-x-1/2 flex justify-center space-x-4 z-50 text-sm">
                        <button
                            disabled={values.prompt.length <= 0}
                            className={`${values.prompt.length <= 0 ? "primaryButton-disabled p-2 cursor-not-allowed" : "primaryButton p-2"} `}
                            type="submit">
                            Generate
                        </button>
                        <button
                            className={`${lines[0].length <= 1 ? "primaryButton-disabled p-2 cursor-not-allowed" : "primaryButton p-2"} `}
                            type="button"
                            disabled={lines[0].length <= 1}
                            onClick={() => setIsPublishWindowOpen(true)}
                        >
                            Publish as New Piece
                        </button>
                    </div>

                    <PopupDialog
                        isOpen={isPublishWindowOpen}
                        setIsOpen={setIsPublishWindowOpen}
                        dialogTitle='Publishing New Piece'
                        dialogContent=''
                        initInputValue={{
                            name: 'Untitled Piece',
                            world_id: world.id,
                            type: 'gen-piece',
                            json_content: { prompt: values.prompt, output: lines.join('\n'), notes: '' },
                            folder_id: null,
                            tags: []
                        } as TypedPiece}
                        confirmAction={async (inputValue: TypedPiece) => {
                            setIsPublishing(true)
                            try {
                                const new_id = await insert_special_piece(inputValue, user.id);
                                setIsPublishing(false)
                                router.push(`/worlds/${world.id}/pieces`)
                                notify_success(<div>
                                    <Link className="underline-offset-2 text-blue-500" href={`/pieces/${new_id}`}>
                                        {new_id}
                                    </Link> successfully posted!
                                </div>, 10000)
                            } catch (error) {
                                setIsPublishing(false)
                                notify_error(`Error posting new piece: ${JSON.stringify(error)}`)
                            }
                        }}
                        dialogType="publish-special-piece"
                    />
                    {isPublishing && <LoadingOverlay />}
                </Form>
            )}
        </Formik>
    </>
}