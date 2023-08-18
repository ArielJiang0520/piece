

import { DefaultWorld, World, WorldPayload } from "@/types/types.world"
import { createNewWorld, editWorld } from "@/utils/world-helpers"
import { useRouter } from "next/navigation"

interface SaveDraftButtonProps {
    uid: string,
    currentDraft: World | DefaultWorld,
    values: WorldPayload,
    setSubmitting: (arg: boolean) => void,
    fetchDrafts: () => Promise<void>;
}
export default function SaveDraftButton({ uid, setSubmitting, values, currentDraft, fetchDrafts }: SaveDraftButtonProps) {
    const router = useRouter();

    const handleSaveNewDraft = async (values: WorldPayload, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true)
        try {
            await createNewWorld(values, uid, true)
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        } finally {
            fetchDrafts();
            setSubmitting(false)
            router.refresh();
        }
    }

    const handleOverwriteDraft = async (values: WorldPayload, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true)
        try {
            await editWorld(values, currentDraft.id, true)
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
            <button className="p-2 secondaryButton text-md" onClick={() => handleSaveNewDraft(values, setSubmitting)} type="button">
                Save as New Draft
            </button> :
            <button className="p-2 secondaryButton text-md" onClick={() => handleOverwriteDraft(values, setSubmitting)} type="button">
                Overwrite Draft
            </button>
    }</>
}