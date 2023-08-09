import type { Piece, PiecePayload, WorldPayload } from "@/types/types.world"
import { postData, updateData, deleteData } from "./helpers";

export const saveNewDraft = async (values: WorldPayload, wid: string, uid: string) => {
    const { origin, images, title, logline, tags, description, settings } = values as WorldPayload;

    let world_data = {
        id: wid,
        origin: origin,
        images: images,
        world_name: title,
        creator_id: uid,
        logline: logline,
        tags: tags,
        description: description,
        is_public: settings.public,
        nsfw: settings.NSFW,
        allow_contribution: settings.allowContribution,
        allow_suggestion: settings.allowSuggestion,
        is_draft: true,
        draft_created_at: new Date().toISOString(),
        draft_modified_at: null,
    }

    await postData({
        url: '/api/create-a-world',
        data: world_data
    });
}

export const publishWorld = async (values: WorldPayload, wid: string, uid: string) => {
    const { origin, images, title, logline, tags, description, settings } = values as WorldPayload;

    let world_data = {
        id: wid,
        origin: origin,
        images: images,
        world_name: title,
        creator_id: uid,
        logline: logline,
        tags: tags,
        description: description,
        is_public: settings.public,
        nsfw: settings.NSFW,
        allow_contribution: settings.allowContribution,
        allow_suggestion: settings.allowSuggestion,
    }

    await postData({
        url: '/api/create-a-world',
        data: world_data
    });
}

export const overwriteWorld = async (values: WorldPayload, wid: string) => {
    const { origin, images, title, logline, tags, description, settings } = values as WorldPayload;

    let world_data = {
        id: wid,
        origin: origin,
        images: images,
        world_name: title,
        logline: logline,
        tags: tags,
        description: description,
        is_public: settings.public,
        nsfw: settings.NSFW,
        allow_contribution: settings.allowContribution,
        allow_suggestion: settings.allowSuggestion,
        modified_at: new Date().toISOString(),
    }

    await updateData({
        url: '/api/create-a-world',
        data: world_data,
        id: wid,
    });
}


export const overwriteDraft = async (values: WorldPayload, wid: string) => {
    const { origin, images, title, logline, tags, description, settings } = values as WorldPayload;

    let world_data = {
        origin: origin,
        images: images,
        world_name: title,
        logline: logline,
        tags: tags,
        description: description,
        is_public: settings.public,
        nsfw: settings.NSFW,
        allow_contribution: settings.allowContribution,
        allow_suggestion: settings.allowSuggestion,
        draft_modified_at: new Date().toISOString(),
    }

    await updateData({
        url: '/api/create-a-world',
        data: world_data,
        id: wid,
    });
}

export const publishDraft = async (wid: string) => {
    let world_data = {
        is_draft: false,
        created_at: new Date().toISOString(),
        modified_at: new Date().toISOString(),
    }

    await updateData({
        url: '/api/create-a-world',
        data: world_data,
        id: wid,
    });
}

export const deleteWorld = async (wid: string) => {
    await deleteData({
        url: 'api/create-a-world',
        id: wid
    })
}

export const editWorld = async (values: WorldPayload, wid: string) => {
    const { origin, images, title, logline, tags, description, settings } = values as WorldPayload;

    let world_data = {
        origin: origin,
        images: images,
        world_name: title,
        logline: logline,
        tags: tags,
        description: description,
        is_public: settings.public,
        nsfw: settings.NSFW,
        allow_contribution: settings.allowContribution,
        allow_suggestion: settings.allowSuggestion,
        modified_at: new Date().toISOString(),
    }

    await updateData({
        url: '/api/create-a-world',
        data: world_data,
        id: wid,
    });
}

export const publishPiece = async (values: PiecePayload, pid: string, wid: string, uid: string) => {
    const { title, logline, tags, content, images, settings } = values as PiecePayload;

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