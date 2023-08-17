import type { Piece, PiecePayload, WorldPayload } from "@/types/types.world"
import { postData, updateData, deleteData, getId } from "./helpers";

// Publish a new piece
export const publishPiece = async (values: PiecePayload, wid: string, uid: string) => {
    const { title, logline, tags, content, images, settings } = values as PiecePayload;
    const pid = `P-${getId()}`

    let piece_data = {
        id: pid,
        world_id: wid,
        creator_id: uid,
        title: title,
        logline: logline,
        tags: tags,
        content: content,
        images: images,
        nsfw: settings.NSFW,
        allow_comments: settings.allowComments,
        created_at: new Date().toISOString(),
        modified_at: null,
    } as Piece

    await postData({
        url: '/api/create-a-piece',
        data: piece_data
    });
}