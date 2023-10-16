'use client'
import { Profile, World, Piece, PiecePayload, GeneralJson, WorldDescriptionSection, WorldPayload } from "./types";
import { WorldMetadata } from "@/app/supabase-server";
import { get_profie } from "@/utils/user-helpers";
import { User } from "@supabase/supabase-js";

export function cast_to_worldpayload(world: World) {
    return {
        tags: world.tags,
        genre1: world.primary_genre,
        genre2: world.secondary_genre,
        images: world.images,
        name: world.name,
        logline: world.logline,
        description: world.description as WorldDescriptionSection[],
        settings: {
            public: world.is_public,
            NSFW: world.nsfw,
            allowContribution: world.allow_contribution,
            allowSuggestion: world.allow_suggestion,
        },
        progress: world.progress
    } as WorldPayload;
}

export async function cast_to_world(payload: WorldPayload, uid: string) {
    const created_at = new Date().toISOString();
    const profile: Profile = await get_profie(uid)
    const world = {
        allow_contribution: payload.settings.allowContribution,
        allow_suggestion: payload.settings.allowSuggestion,
        nsfw: payload.settings.NSFW,
        is_public: payload.settings.public,

        progress: payload.progress,

        primary_genre: payload.genre1,
        secondary_genre: payload.genre2,

        created_at: created_at,
        modified_at: null,

        creator_id: uid,

        description: payload.description,
        id: '',
        images: payload.images,
        logline: payload.logline,

        tags: payload.tags,
        name: payload.name,

        is_draft: true,
        draft_created_at: created_at,
        draft_modified_at: null
    } as World

    const metadata = {
        profiles: profile,
        pieces: [{ count: 0 }], // count
        subscriptions: [{ count: 0 }]// count
    }

    return { ...world, ...metadata } as WorldMetadata
}

export function cast_to_profile(user: User) {
    return {
        avatar_url: user.user_metadata.avatar_url,
        full_name: user.user_metadata.full_name,
        id: user.id,
        updated_at: null,
        username: user.user_metadata.name,
        website: null,
    } as Profile
}


export function cast_to_piecepayload(piece: Piece): PiecePayload {
    return {
        name: piece.name,
        tags: piece.tags,
        content: (piece.piece_json as GeneralJson).content,
        images: (piece.piece_json as GeneralJson).images,
        folder_id: piece.folder_id,
        settings: {
            NSFW: piece.nsfw,
            allowComments: piece.allow_comments,
        }
    } as PiecePayload
}