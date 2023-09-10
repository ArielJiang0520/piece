'use client'
import { World, WorldDescriptionSection, WorldPayload, JoinedWorldAll } from "./types";
import { get_fandom } from "@/utils/data-helpers";
import { get_profile } from "@/utils/user-helpers";

export function cast_to_worldpayload(world: World) {
    return {
        origin: world.origin,
        tags: world.tags,
        characters: world.characters,
        relationship_types: world.relationship_types,
        relationships: world.relationships,
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
    const fandom = payload.origin ? await get_fandom(payload.origin) : null
    const profile = await get_profile(uid)

    return {
        allow_contribution: payload.settings.allowContribution,
        allow_suggestion: payload.settings.allowSuggestion,
        nsfw: payload.settings.NSFW,
        is_public: payload.settings.public,

        created_at: created_at,
        modified_at: null,

        creator_id: uid,

        description: payload.description,
        id: '',
        images: payload.images,
        logline: payload.logline,


        origin: payload.origin,
        relationship_types: payload.relationship_types,
        tags: payload.tags,
        relationships: payload.relationships,
        characters: payload.characters,
        name: payload.name,

        is_draft: true,
        draft_created_at: created_at,
        draft_modified_at: null,

        fandoms: fandom,
        subscriptions: [{ count: 0 }],
        pieces: [{ count: 0 }],
        profiles: profile,
    } as JoinedWorldAll;
}
