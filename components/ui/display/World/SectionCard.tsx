'use client'
import { useEffect, useState } from "react";
import { PlusCircleIcon, MinusIcon, PencilIcon, TrashIcon } from "@/components/icon/icon";
import type { WorldDescriptionSectionCard } from "@/types/types";
import PopupDialog from "@/components/ui/input/PopupDialog";
import { ImagesDisplayRow } from "@/components/ui/image/ImagesDisplayRow";
import { IconButtonTiny } from "@/components/ui/button/button-helpers";
import { FieldContentDisplay, FieldTitleDisplay } from "@/components/ui/display/display-helpers";
import { ImagesUpload } from "@/components/ui/image/ImagesUpload";

export const SectionCardDisplay = ({ card }: {
    card: WorldDescriptionSectionCard,
}) => {
    return <div className="grid grid-cols-1 w-full border rounded-lg py-2 px-4 ">
        <FieldContentDisplay content={card.cardTitle} textSize="text-xl" />
        <FieldContentDisplay content={card.cardContent} textSize="text-sm" />
    </div>
}

export const SectionCard = ({ card, onSave, onDel }: {
    card: WorldDescriptionSectionCard,
    onSave: (newCard: WorldDescriptionSectionCard) => void;
    onDel: () => void,
}) => {

    const [curCard, setCurCard] = useState(card);

    return (
        <div className="grid grid-cols-1 w-full border rounded-lg py-2 px-4 ">
            <input
                id="cardTitle"
                type="text"
                className="w-full singleLineInput text-lg"
                placeholder={'New title...'}
                value={curCard.cardTitle}
                onChange={(e) => setCurCard(prevCard => {
                    return {
                        ...prevCard,
                        cardTitle: e.target.value
                    }
                })}
                onBlur={() => onSave(curCard)}
            />
            <textarea
                id="cardContent"
                className="w-full min-h-[150px] multiLineInput text-sm"
                placeholder={'New content...'}
                value={curCard.cardContent}
                onChange={(e) => setCurCard(prevCard => {
                    return {
                        ...prevCard,
                        cardContent: e.target.value
                    }
                })}
                onBlur={() => onSave(curCard)}

            />
            <FieldTitleDisplay label={"Upload card images"} textSize="text-sm" />
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

            <div className="mt-2 flex flex-row justify-end items-center space-x-2">
                <button type="button" onClick={(event) => {
                    event.stopPropagation();
                    onDel()
                }}>
                    <IconButtonTiny icon={<TrashIcon />} />
                </button>
            </div>
        </div>
    )
}