'use client'
import { useState } from "react"
import PopupDialog from "@/components/ui/input/PopupDialog"
import { DefaultPiece, Piece, PiecePayload } from "@/types/types"
import { insert_piece, update_piece, publish_draft } from "@/utils/piece-helpers"
import { useRouter } from "next/navigation"
import { useToast } from "@/app/toast-providers"

interface PublishButtonProps {
    uid: string,
    wid: string,
    currentDraft: Piece | DefaultPiece,
    values: PiecePayload,
    setSubmitting: (arg: boolean) => void,
}
export default function PublishButton({ uid, wid, currentDraft, values, setSubmitting }: PublishButtonProps) {
    const [msgOpen, setMsgOpen] = useState(false)
    const [isPublishConfirm, setIsPublishConfirm] = useState(false)
    const router = useRouter()
    const { showMessage } = useToast();

    // Publish the current piece
    const submitPiece = async (values: PiecePayload, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true)

        let piece_id: string | null = null
        try {
            if ("default" in currentDraft) { // if directly publish from blank
                piece_id = await insert_piece(values, uid, wid, false)
            } else if (currentDraft.is_draft) { // if publish from draft
                piece_id = await update_piece(values, currentDraft.id, true)
                piece_id = await publish_draft(currentDraft.id)
            } else { // if editing an existing piece
                piece_id = await update_piece(values, currentDraft.id, false)
            }
        } catch (error) {
            alert(`Error: ${JSON.stringify(error)}`);
        } finally {
            setSubmitting(false)
            setIsPublishConfirm(false)
        }
    }

    return <>
        <button className="flex items-center justify-center primaryButton text-xl w-full h-full py-3" onClick={() => { setIsPublishConfirm(true) }} type="button">
            Publish
        </button>
        <PopupDialog
            isOpen={isPublishConfirm}
            setIsOpen={setIsPublishConfirm}
            dialogTitle='Publishing your piece'
            dialogContent='Are you sure you want to publish this piece?'
            initInputValue={null}
            confirmAction={() => submitPiece(values, setSubmitting)}
            dialogType='confirm'
        />
    </>
}