import { useState } from "react"
import PopupDialog from "@/components/ui/input/PopupDialog"
import { WorldPayload, cast_to_world } from "@/types/types"
import WorldDisplay from "@/components/ui/display/World/WorldDisplay"
import { EyeIcon } from "@/components/icon/icon"

interface PreviewButtonProps {
    values: WorldPayload,
    uid: string
}
export default function PreviewButton({ values, uid }: PreviewButtonProps) {
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    return <>
        <button className="flex items-center justify-center w-full h-full p-2 primaryButton" onClick={() => setIsReviewOpen(true)} type="button">
            <EyeIcon className="w-6 h-6" />
        </button>
        <PopupDialog
            isOpen={isReviewOpen}
            setIsOpen={setIsReviewOpen}
            dialogTitle='Preview of your world'
            dialogContent=''
            initInputValue={<WorldDisplay world={cast_to_world(values, uid)} preview={true} />}
            confirmAction={() => { }}
            dialogType='display'
            hideCancel={true}
            overwriteConfirm='Close'
        /></>
}