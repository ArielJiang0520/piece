'use client'
import { ReactNode, useEffect, useState } from "react"
import PopupDialog from "@/components/ui/input/PopupDialog"
import { WorldPayload } from "@/types/types"
import { cast_to_world } from "@/types/cast-types"
import WorldDisplay from "@/components/ui/display/World/WorldDisplay"
import { EyeIcon } from "@/components/icon/icon"

interface PreviewButtonProps {
    values: WorldPayload,
    uid: string
}
export default function PreviewButton({ values, uid }: PreviewButtonProps) {
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [castedWorld, setCastedWorld] = useState<ReactNode | null>(null)

    useEffect(() => {
        const fetchCastedWorld = async () => {
            const world = await cast_to_world(values, uid);
            setCastedWorld(<WorldDisplay world={world} preview={true} />)
        };
        fetchCastedWorld();
    }, [isReviewOpen])

    return <>
        <button className="flex items-center justify-center w-full h-full p-2 primaryButton rounded-lg" onClick={() => setIsReviewOpen(true)} type="button">
            <EyeIcon className="w-6 h-6" />
        </button>
        <PopupDialog
            isOpen={isReviewOpen}
            setIsOpen={setIsReviewOpen}
            dialogTitle='Preview of your world'
            dialogContent=''
            initInputValue={castedWorld}
            confirmAction={() => { }}
            dialogType='display'
            hideCancel={true}
            overwriteConfirm='Close'
        />
    </>
}