'use client'
import { Formik, Field, FormikProps, Form, ErrorMessage, FieldProps, setIn } from 'formik';
import { FieldContentDisplay, FieldTitleDisplay, GeneratePriceDisplay } from '@/components/ui/display/display-helpers';
import { TextInput } from '@/components/ui/input/InputTextField';
import { GenPieceJson, Modifier, Piece, TypedPiece, World } from '@/types/types';
import useStreamText from '@/hooks/useStreamText';
import { useEffect, useState, useRef } from 'react';
import PopupDialog from '@/components/ui/input/PopupDialog';
import { fetch_piece, fetch_all_pieces, insert_special_piece } from '@/utils/piece-helpers';
import { fetch_prompt, insert_prompt_history } from '@/utils/prompt-helpers';
import { useSupabase } from '@/app/supabase-provider';
import { useSearchParams } from 'next/navigation';
import { notify_error, notify_success } from '@/components/ui/widget/toast';
import Link from 'next/link';
import { LoadingOverlay } from '@/components/ui/widget/loading';
import { ToggleButton } from '@/components/ui/button/toggle/Toggle';
import DropDownSelector from '@/components/ui/input/DropDownSelector';
import SearchBar from '@/components/ui/input/SearchBar';
import { HistoryIcon, ResetIcon, StarIcon } from '@/components/icon/icon';
import { IconButtonMid, IconButtonSmall } from '@/components/ui/button/button-helpers';
import ChooseModifiers from './ChooseModifiers';

export interface PromptPayload {
    prompt: string,
    model: string,
    origin: string,
    modifiers: Modifier[],
}
export default function Generate({ models }: { models: any[] }) {
    // const modelList = models.map((model, idx) => {return { id: idx, model: model } })

    const { user } = useSupabase()
    const { lines, isLoading, resetLines, streamText } = useStreamText();
    const [saved, setSaved] = useState(false)

    const [isPublishWindowOpen, setIsPublishWindowOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const formikRef = useRef<FormikProps<PromptPayload> | null>(null);
    const [isFormikRendered, setIsFormikRendered] = useState(false);
    const [initValues, setInitValues] = useState({ prompt: '', model: "gpt-4", modifiers: [], origin: '' } as PromptPayload)


    // Add effect to change state when Formik has been rendered
    useEffect(() => {
        if (formikRef.current) {
            setIsFormikRendered(true);
        }
    }, [formikRef.current]);

    useEffect(() => {
        if (isFormikRendered) {
            formikRef.current?.resetForm({ values: initValues })
        }
    }, [isFormikRendered, initValues]); // Listen to changes on initValues


    if (!user) {
        return <>No user found!</>
    }

    const handleSubmit = async (values: PromptPayload) => {
        const data = {
            prompt: values.prompt,
            model: values.model,
            modifiers: values.modifiers,
            origin: values.origin
        }
        await streamText(data, '/api/generate/piecev2')
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
            initialValues={initValues}
            innerRef={formikRef} // Attach the ref to Formik
            onSubmit={(values) => {
                handleSubmit(values);
            }}
        >
            {({ isSubmitting, isValid, values, errors, touched, setFieldValue, setSubmitting, setErrors, resetForm }) => (
                <Form className='mt-4 w-full flex flex-col space-y-4 items-start' onKeyDown={handleKeyDown}>

                    <div id="model-group" className='w-full flex flex-col space-y-4'>
                        <FieldTitleDisplay label={"model"} />
                        <DropDownSelector
                            data={models}
                            selected={models.find(m => m.id === values.model)}
                            setSelected={(model) => setFieldValue('model', model.id)}
                            width='w-80'
                            nameKey='id'
                        />
                    </div>

                    <div id="origin-group" className='w-full flex flex-col'>
                        <div className='flex flex-row items-center justify-between '>
                            <FieldTitleDisplay label={"origin"} />
                        </div>
                        <TextInput name={"origin"} placeholder={"Add your origin..."} textSize={"text-base"} multiline={1} bold={"font-medium"} />
                    </div>

                    <div id="modifier-group" className='w-full flex flex-col'>
                        <div className='flex flex-row items-center justify-between '>
                            <FieldTitleDisplay label={"modifiers"} />
                        </div>
                        <ChooseModifiers />
                    </div>

                    <div id="prompt-group" className='w-full flex flex-col'>
                        <div className='flex flex-row items-center justify-between '>
                            <div className='flex flex-row items-center space-x-3'>
                                <FieldTitleDisplay label={"prompt"} />
                                <ResetIcon className='text-foreground/50 cursor-auto' onClick={() => setFieldValue('prompt', '')} />
                            </div>
                        </div>
                        <TextInput name={"prompt"} placeholder={"Add your prompt..."} textSize={"text-base"} multiline={7} bold={"font-medium"} />
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
                            disabled={values.prompt.length <= 0 || isLoading}
                            className={`${(values.prompt.length <= 0 || isLoading) ? "primaryButton-disabled p-2 cursor-not-allowed" : "primaryButton p-2"} rounded-lg`}
                            type="submit">
                            Generate
                        </button>

                        <button
                            className={`${lines[0].length <= 1 ? "primaryButton-disabled p-2 cursor-not-allowed" : "primaryButton p-2"} rounded-lg`}
                            type="button"
                            disabled={lines[0].length <= 1}
                            onClick={() => setIsPublishWindowOpen(true)}
                        >
                            Publish as New Piece
                        </button>


                    </div>
                    {/* 
                    <PopupDialog
                        isOpen={isPublishWindowOpen}
                        setIsOpen={setIsPublishWindowOpen}
                        dialogTitle='Publishing New Piece'
                        dialogContent=''
                        initInputValue={{
                            name: '',
                            world_id: world.id,
                            type: 'gen-piece',
                            json_content: {
                                prompt: values.prompt,
                                output: lines.join('\n'),
                                model: values.model,
                                notes: '',
                                prequel: values.prequel
                            } as GenPieceJson,
                            folder_id: null,
                            tags: [],
                        } as TypedPiece}
                        confirmAction={async (inputValue: TypedPiece) => {
                            setIsPublishing(true)
                            try {
                                const new_id = await insert_special_piece(inputValue, user.id);
                                setIsPublishing(false)
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
                    {isPublishing && <LoadingOverlay />} */}
                </Form>
            )}
        </Formik>
    </>
}