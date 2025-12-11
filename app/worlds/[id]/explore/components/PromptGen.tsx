'use client'
import { Formik, Field, FormikProps, Form, ErrorMessage, FieldProps, setIn } from 'formik';
import { FieldContentDisplay, FieldTitleDisplay, GeneratePriceDisplay } from '@/components/ui/display/display-helpers';
import { TextInput } from '@/components/ui/input/InputTextField';
import { GenPieceJson, Piece, TypedPiece, World } from '@/types/types';
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

interface PromptPayload {
    prompt: string,
    model: string,
    temperature: number,
    prequel: string | null,
}
export default function PromptGen({ world, models }: { world: World, models: any[] }) {
    // const modelList = models.map((model, idx) => {return { id: idx, model: model } })
    const searchParams = useSearchParams();
    const { user } = useSupabase()
    const { lines, isLoading, resetLines, streamText, isThinking } = useStreamText();
    // const [saved, setSaved] = useState(false)

    const [isPublishWindowOpen, setIsPublishWindowOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const formikRef = useRef<FormikProps<PromptPayload> | null>(null);
    const [isFormikRendered, setIsFormikRendered] = useState(false);
    const defaultModel = models[0]["id"]
    const [initValues, setInitValues] = useState({ prompt: '', model: defaultModel, prequel: null, temperature: 1.0 } as PromptPayload)

    const [pieces, setPieces] = useState<{ id: string, name: string }[]>([]);

    const fetchPromptFromPiece = async (piece_id: string) => {
        try {
            const piece = await fetch_piece(piece_id);
            const newValues = {
                ...initValues,
                prompt: (piece.piece_json as GenPieceJson).prompt,
                prequel: (piece.piece_json as GenPieceJson).prequel
            };
            setInitValues(newValues);
        } catch (e) {
            notify_error(`Fetching piece_id ${piece_id} for prompt failed: ${JSON.stringify(e)}`)
        }
    }

    const fetchPromptFromId = async (prompt_id: string) => {
        try {
            const prompt = await fetch_prompt(prompt_id);
            const newValues = { ...initValues, prompt: prompt.prompt };
            setInitValues(newValues);
        } catch (e) {
            notify_error(`Fetching prompt_id ${prompt_id} failed: ${JSON.stringify(e)}`)
        }
    }

    const fetchPieces = async () => {
        const fetchedPieces = await fetch_all_pieces(world.id);
        setPieces(fetchedPieces);
    }

    useEffect(() => {
        fetchPieces();
    }, [])

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

    useEffect(() => {
        const prompt_id = searchParams.get('prompt_id');
        if (prompt_id) {
            if (prompt_id.startsWith('P-')) {
                fetchPromptFromPiece(prompt_id);
            } else {
                fetchPromptFromId(prompt_id);
            }
        }
        const prequel_id = searchParams.get('prequel')
        if (prequel_id) {
            const newValues = { ...initValues, prequel: prequel_id };
            setInitValues(newValues)
        }
    }, [searchParams])

    // useEffect(() => {
    //     console.log(lines)
    // }, [lines])

    if (!user) {
        return <>No user found!</>
    }

    const handleSubmit = async (values: PromptPayload) => {
        const data = {
            prompt: values.prompt,
            model: values.model,
            prequel: values.prequel,
            world: world,
            temperature: values.temperature
        }

        await streamText(data, '/api/generate/models')
            .then()
            .catch((error: Error) => {
                alert(error.message);
            });

    }

    // const saveHistory = async (values: PromptPayload) => {
    //     try {
    //         await insert_prompt_history(world.id, user.id, {
    //             prompt: values.prompt,
    //             model: values.model,
    //             notes: '',
    //             prequel: values.prequel,
    //             output: lines.join('\n')
    //         })
    //         setSaved(true)
    //     } catch {
    //         notify_error("Failed to save history")
    //     }
    // }

    const handleQuickPublish = async (values: PromptPayload) => {
        const inputValue = {
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
        } as TypedPiece

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
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && (event.target as HTMLElement).nodeName !== 'TEXTAREA') {
            event.preventDefault();
        }
    };

    // useEffect(() => {
    //     if (!isLoading && lines[0].length > 1 && !saved) {
    //         if (formikRef.current) {
    //             const values = formikRef.current.values;
    //             saveHistory(values)
    //         }
    //     } else if (isLoading) {
    //         setSaved(false)
    //     } else {
    //         console.log(isLoading, lines, saved)
    //     }
    // }, [isLoading])

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

                    {/* <div className='flex flex-row w-full justify-end font-mono text-brand text-sm'>
                        <Link
                            href={`/profiles/${user.id}/history`}
                            className={`cursor-pointer bg-none  flex flex-row items-center justify-center space-x-1 rounded-lg border border-brand py-1 px-2   whitespace-nowrap`}

                        >
                            <HistoryIcon />
                            <div>View History</div>
                        </Link>
                    </div> */}

                    <div id="model-selection-group" className='w-full flex flex-col space-y-4'>
                        <FieldTitleDisplay label={"model"} />
                        <DropDownSelector
                            data={models}
                            selected={models.find(m => m.id === values.model)}
                            setSelected={(model) => setFieldValue('model', model.id)}
                            width='w-80'
                            nameKey='id'
                        />
                    </div>

                    <div id="temp-group" className='w-full flex flex-col space-y-4'>
                        <FieldTitleDisplay label={"temperature"} />
                        <TextInput name={"temperature"} placeholder={"0.6"} textSize={"text-base"} multiline={1} />
                    </div>


                    <div id="link-group" className='w-full flex flex-col space-y-4'>
                        <FieldTitleDisplay label={"prequel"} />
                        <SearchBar
                            candidates={pieces}
                            nameKey='id'
                            placeholder='Select a piece...'
                            onSelect={(item) => { setFieldValue('prequel', item.id) }}
                            display_func={(item) => `${item.id}: ${item.name}`}
                            hasReset={true}
                            defaultSelectedId={values.prequel}
                        />
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
                        <div className='w-full flex flex-row space-x-3'>
                            <div>
                                <FieldTitleDisplay label={"AI Generated Content"} />
                            </div>
                            <div>
                                {/* loading icon for isThinking */}
                                {isThinking && <div className='animate-pulse text-foreground/50'>{"(thinking...)"}</div>}
                            </div>
                        </div>
                        <div className='px-4 py-2 my-2 rounded-lg bg-foreground/5 overflow-y-auto cursor-not-allowed' style={{ height: '700px' }}>
                            {lines.map((line, index) => (
                                <p key={index} className='leading-loose font-mono text-sm'>{line}</p>
                            ))}
                        </div>
                    </div>

                    {/* {finished && <div>Finished!</div>} */}

                    <GeneratePriceDisplay world={world} />

                    <div className='block h-20'>

                    </div>

                    <div className="fixed bottom-7 left-1/2 transform -translate-x-1/2 flex justify-center space-x-4 z-50 text-sm">

                        <button
                            disabled={values.prompt.length <= 0 || isLoading}
                            className={`${(values.prompt.length <= 0 || isLoading) ? "primaryButton-disabled p-2 cursor-not-allowed" : "primaryButton p-2"} rounded-lg`}
                            type="submit">
                            Generate
                        </button>

                        {/* <button
                            className={`${lines[0].length <= 1 ? "primaryButton-disabled p-2 cursor-not-allowed" : "primaryButton p-2"} rounded-lg`}
                            type="button"
                            disabled={lines[0].length <= 1}
                            onClick={() => setIsPublishWindowOpen(true)}
                        >
                            Publish as New Piece
                        </button> */}

                        <button
                            className={`${lines.every(line => line.length <= 1) ? "primaryButton-disabled p-2 cursor-not-allowed" : "primaryButton p-2"} rounded-lg`}
                            type="button"
                            disabled={lines.every(line => line.length <= 1)}
                            onClick={() => handleQuickPublish(values)}
                        >
                            Quick Publish
                        </button>
                    </div>

                    {/* <PopupDialog
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
                    /> */}
                    {isPublishing && <LoadingOverlay />}
                </Form>
            )}
        </Formik>
    </>
}