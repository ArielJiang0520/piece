'use client'
import { Profile, World, WorldDescriptionSection, WorldPayload } from "./types";
import { WorldMetadata } from "@/app/supabase-server";
import { get_profile } from "@/utils/user-helpers";

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
        }
    } as WorldPayload;
}

export async function cast_to_world(payload: WorldPayload, uid: string) {
    const created_at = new Date().toISOString();
    const profile: Profile = await get_profile(uid)
    const world = {
        allow_contribution: payload.settings.allowContribution,
        allow_suggestion: payload.settings.allowSuggestion,
        nsfw: payload.settings.NSFW,
        is_public: payload.settings.public,

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
