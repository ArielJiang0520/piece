
import { useState } from "react"
import PopupDialog from "@/components/ui/input/PopupDialog"
import { DefaultWorld, World, WorldPayload } from "@/types/types.world"
import { createNewWorld, editWorld, publishDraft } from "@/utils/world-helpers"
import { useRouter } from "next/navigation"

interface PublishButtonProps {
    uid: string,
    currentDraft: World | DefaultWorld,
    values: WorldPayload,
    setSubmitting: (arg: boolean) => void,
}
export default function PublishButton({ uid, currentDraft, values, setSubmitting }: PublishButtonProps) {
    const [isPublishConfirm, setIsPublishConfirm] = useState(false)
    const router = useRouter()

    // Publish the current world
    const submitWorld = async (values: WorldPayload, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true)
        let world_id: string | null = null
        try {
            if ("default" in currentDraft) { // if directly publish from blank
                world_id = await createNewWorld(values, uid, false)
            } else if (currentDraft.is_draft) { // if publish from draft
                world_id = await editWorld(values, currentDraft.id, true)
                world_id = await publishDraft(currentDraft.id)
            } else { // if editing an existing world
                world_id = await editWorld(values, currentDraft.id, false)
            }
        } catch (error) {
            alert(`Error: ${JSON.stringify(error)}`);
        } finally {
            if (world_id)
                router.push(`/world/${world_id}`); // Redirect to world page
            else
                router.refresh()
            setSubmitting(false)
        }
    }

    return <>
        <button className="flex items-center justify-center primaryButton text-xl w-full h-full py-3" onClick={() => { setIsPublishConfirm(true) }} type="button">
            Publish
        </button>
        <PopupDialog
            isOpen={isPublishConfirm}
            setIsOpen={setIsPublishConfirm}
            dialogTitle='Publishing your world'
            dialogContent='Are you sure you want to publish this world?'
            initInputValue={null}
            confirmAction={() => submitWorld(values, setSubmitting)}
            dialogType='confirm'
        />
    </>
}