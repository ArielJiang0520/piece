'use client'
import { useState, useEffect } from "react";
import { debounce } from 'lodash';
import { SingleUserIcon, TrashIcon } from "@/components/icon/icon";
import type { WorldDescriptionSectionCard } from "@/types/types";
import { ImagesDisplayRow } from "@/components/ui/image/ImagesDisplayRow";
import { IconButtonTiny } from "@/components/ui/button/button-helpers";
import { FieldContentDisplay, FieldTitleDisplay } from "@/components/ui/display/display-helpers";
import { ImagesUpload } from "@/components/ui/image/ImagesUpload";
import { Markdown } from "@/components/ui/display/display-helpers";
import { ToggleButton } from "@/components/ui/button/toggle/Toggle";
import { HelpTooltip } from "@/components/ui/widget/tooltip";
import { TextInputFreeform } from "@/components/ui/input/InputTextField";
import { notify_success } from "../../widget/toast";

export const SectionCardDisplay = ({ card }: {
    card: WorldDescriptionSectionCard,
}) => {
    return <div className="grid grid-cols-1 gap-3 border rounded-lg p-4">
        <ImagesDisplayRow bucket="world" dimension={{ height: "h-56", width: "w-56" }} paths={card.cardImages} popup={true} />
        <div className="flex flex-row items-center space-x-2">
            <FieldContentDisplay content={card.cardTitle} textSize="text-xl" bold="font-semibold" />
            {card.isCharacterCard && <SingleUserIcon className="text-foreground/80" />}
        </div>
        <div className="hpx w-full border-t" />
        <Markdown className="font-serif text-sm">{card.cardContent}</Markdown>
    </div>
}

export const SectionCard = ({ card, onSave, onDel }: {
    card: WorldDescriptionSectionCard,
    onSave: (newCard: WorldDescriptionSectionCard) => void;
    onDel: () => void,
}) => {
    const [curCard, setCurCard] = useState(card);

    useEffect(() => {
        const debouncedSave = debounce(onSave, 300);
        debouncedSave(curCard);
        return () => debouncedSave.cancel();
    }, [curCard, onSave]);

    return (
        <>
            <div className="grid grid-cols-1 w-full border rounded-lg py-4 px-4 space-y-4">
                <div className="flex flex-col">
                    <FieldTitleDisplay label={"CARD TITLE"} textSize="text-sm" />
                    <TextInputFreeform
                        placeholder={'New title...'}
                        initValue={curCard.cardTitle}
                        onChange={(newString) => setCurCard(prevCard => {
                            return {
                                ...prevCard,
                                cardTitle: newString
                            }
                        })}
                        textSize="font-sm"
                        multiline={1}
                    />
                </div>
                <div className="flex flex-col">
                    <FieldTitleDisplay label={"card content"} textSize="text-sm" />
                    <TextInputFreeform
                        placeholder={'Your card content...'}
                        initValue={curCard.cardContent}
                        onChange={(newString) => setCurCard(prevCard => {
                            return {
                                ...prevCard,
                                cardContent: newString
                            }
                        })}
                        textSize="font-sm"
                        multiline={10}
                    />
                </div>
                <div className="flex flex-col">
                    <FieldTitleDisplay label={"card images"} textSize="text-sm" />
                    <ImagesUpload
                        dimension={{ height: "h-72", width: "w-72" }}
                        initPaths={curCard.cardImages}
                        setValues={(paths: string[]) => {
                            setCurCard(prevCard => {
                                return {
                                    ...prevCard,
                                    cardImages: paths
                                }
                            })
                        }}
                        folder={``}
                        bucket={"world"}
                        maxNum={3}
                    />
                </div>

                <div className="flex flex-col font-mono font-xs justify-center">
                    <div className="flex flex-row items-center space-x-1 mb-2">
                        <FieldTitleDisplay label="is character card?" textSize="text-sm" />
                        <HelpTooltip tooltipText="Toggle this if the card represents a characters. " />
                    </div>

                    <ToggleButton
                        handleToggle={() =>
                            setCurCard(prevCard => {
                                return {
                                    ...prevCard,
                                    isCharacterCard: !prevCard.isCharacterCard
                                }
                            })
                        }
                        isEnabled={curCard.isCharacterCard}
                    />
                </div>

                <div className="flex flex-row justify-end items-center space-x-2">
                    {/* <button className="primaryButton font-mono text-sm px-4 py-1" type="button" onClick={() => { onSave(curCard); notify_success(`Card "${curCard.cardTitle}" saved!`); }}>
                        Save
                    </button> */}

                    <button type="button" onClick={(event) => {
                        event.stopPropagation();
                        onDel()
                    }}>
                        <IconButtonTiny icon={<TrashIcon />} />
                    </button>
                </div>


            </div>
        </>
    )
}