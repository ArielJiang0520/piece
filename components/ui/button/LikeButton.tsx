import { useEffect, useState } from "react"
import { IconButtonTiny } from "./button-helpers"
import { EmptyHeartIcon, FilledHeartIcon } from "@/components/icon/icon"
import { notify_error } from "../widget/toast"
import { like_a_piece, unlike_a_piece } from "@/utils/stats-helpers"

export function LikeButton({ initLikes, initIsLiked, pid, uid }: { initLikes: number, initIsLiked: boolean, pid: string, uid: string }) {
    const [likes, setLikes] = useState<number>(initLikes)
    const [isLiked, setIsLiked] = useState(initIsLiked)

    const onClickLike = () => {
        if (isLiked) {
            try {
                unlike_a_piece(pid, uid)
                setLikes(likes - 1);
                setIsLiked(false);
            } catch (error) {
                notify_error(`Failed to like this piece: ${JSON.stringify(error)}`)
            }

        } else {
            try {
                like_a_piece(pid, uid)
                setLikes(likes + 1);
                setIsLiked(true);
            } catch (error) {
                notify_error(`Failed to unlike this piece: ${JSON.stringify(error)}`)
            }
        }
    }

    return <div onClick={onClickLike}>
        {isLiked ? <IconButtonTiny icon={<FilledHeartIcon className="text-red-500" />} title={likes} />
            : <IconButtonTiny icon={<EmptyHeartIcon className="text-foreground/50" />} title={likes} />}
    </div>

}