import { DefaultPiece, Piece, PiecePayload } from "@/types/types"
import { insert_piece, update_piece } from "@/utils/piece-helpers"
import { useRouter } from "next/navigation"

interface SaveDraftButtonProps {
    uid: string,
    wid: string,
    currentDraft: Piece | DefaultPiece,
    values: PiecePayload,
    setSubmitting: (arg: boolean) => void,
    fetchDrafts: () => Promise<void>;
}
export default function SaveDraftButton({ uid, wid, setSubmitting, values, currentDraft, fetchDrafts }: SaveDraftButtonProps) {
    const router = useRouter();

    const handleSaveNewDraft = async (values: PiecePayload, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true)
        try {
            await insert_piece(values, uid, wid, true)
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        } finally {
            fetchDrafts();
            setSubmitting(false)
            router.refresh();
        }
    }

    const handleOverwriteDraft = async (values: PiecePayload, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true)
        try {
            await update_piece(values, currentDraft.id, true)
        } catch (error) {
            alert(`Error: ${JSON.stringify(error)}`);
        } finally {
            fetchDrafts();
            setSubmitting(false)
            router.refresh();
        }
    }

    return <>{
        'default' in currentDraft ?
            <button className="p-2 secondaryButton text-base" onClick={() => handleSaveNewDraft(values, setSubmitting)} type="button">
                Save as New Draft
            </button> :
            <button className="p-2 secondaryButton text-base" onClick={() => handleOverwriteDraft(values, setSubmitting)} type="button">
                Overwrite Draft
            </button>
    }</>
}