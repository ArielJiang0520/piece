import { User } from "@supabase/supabase-js"
import { Database } from "./supabase"

export type World = Database['public']['Tables']['worlds']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Piece = Database['public']['Tables']['pieces']['Row']
export type Folder = Database['public']['Tables']['folders']['Row']
export type Fandom = Database['public']['Tables']['fandoms']['Row']
export type FandomMediaType = Database['public']['Tables']['fandoms_media_types']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type TagCategory = Database['public']['Tables']['tags_categories']['Row']
export type Character = Database['public']['Tables']['characters']['Row']
export type Relationship = Database['public']['Tables']['relationships']['Row']

export type WorldDescriptionSectionCard = {
    cardTitle: string,
    cardContent: string,
    cardImages: string[],
}

export type WorldDescriptionSection = {
    sectionTitle: string,
    sectionCards: WorldDescriptionSectionCard[]
}

export type WorldSettings = {
    public: boolean,
    NSFW: boolean,
    allowContribution: boolean,
    allowSuggestion: boolean,
}

export const WorldSettingsAsks = {
    public: "Make the world public",
    NSFW: "Contains NSFW Content",
    allowContribution: "Allow contribution from other users",
    allowSuggestion: "Allow suggestions from other users",
}


export interface DefaultWorld {
    id: string,
    name: string,
    default: boolean
}

export type RelationshipType = 'No Relationship' | 'M/M' | 'M/F' | 'F/F' | 'Others'

export type WorldPayload = {
    origin: string | null, // fandom.id
    tags: string[],
    characters: string[],
    relationship_types: RelationshipType[],
    relationships: string[],
    images: string[],
    name: string,
    logline: string,
    description: WorldDescriptionSection[],
    settings: WorldSettings
}

export const EmptyWorldPayload: WorldPayload = {
    origin: null,
    tags: [],
    characters: [],
    relationship_types: ['No Relationship'],
    relationships: [],
    images: [],
    name: "",
    logline: "",
    description: [

        {
            sectionTitle: "Premise",
            sectionCards: []
        },
        {
            sectionTitle: "Characters",
            sectionCards: []
        },
        {
            sectionTitle: "Additional Settings",
            sectionCards: []
        }
    ],
    settings: {
        public: true,
        NSFW: false,
        allowContribution: true,
        allowSuggestion: true,
    }
}

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
    } as WorldPayload
}

export function cast_to_world(payload: WorldPayload, uid: string) {
    const created_at = new Date().toISOString()
    return {
        allow_contribution: payload.settings.allowContribution,
        allow_suggestion: payload.settings.allowSuggestion,
        created_at: created_at,
        creator_id: uid,
        description: payload.description,
        id: '',
        images: payload.images,
        logline: payload.logline,
        modified_at: created_at,
        nsfw: payload.settings.NSFW,
        origin: payload.origin,
        is_public: payload.settings.public,
        relationship_types: payload.relationship_types,
        tags: payload.tags,
        relationships: payload.relationships,
        characters: payload.characters,
        name: payload.name,
        is_draft: true,
        draft_created_at: created_at,
        draft_modified_at: created_at,
    } as World
}

export type PiecePayload = {
    title: string,
    logline: string,
    tags: string[],
    content: string,
    folder_id: string,
    images: string[],
    settings: PieceSettings
}

export type PieceSettings = {
    NSFW: boolean,
    allowComments: boolean;
}

export interface JoinedWorldPiece extends Piece {
    worlds: { name: string } | null
}

export interface JoinedAuthorPiece extends Piece {
    profiles: Profile | null
}

export interface DefaultFolder {
    id: string,
    folder_name: string,
    default: boolean
}

export const PieceSettingsAsks = {
    NSFW: "Contains NSFW Content",
    allowComments: "Allow comments from other users"
}

export const EmptyPiecePayload: PiecePayload = {
    title: "",
    logline: "",
    tags: [],
    content: "",
    folder_id: "",
    images: [],
    settings: {
        NSFW: false,
        allowComments: true
    }
}

export function cast_to_piece(payload: PiecePayload) {
    const created_at = new Date().toISOString()
    return {
        created_at: created_at,
        title: payload.title,
        logline: payload.logline,
        tags: payload.tags,
        content: payload.content,
        images: payload.images,
        folder_id: payload.folder_id,
        nsfw: payload.settings.NSFW,
        allow_comments: payload.settings.allowComments,
    } as Piece
}

export const EmptyFandom: Fandom = {
    name: '',
    aliases: [],
    media_type: '',
    num_of_worlds: 0,
    created_at: '',
    id: ''
}

export function user_to_profile(user: User) {
    return {
        avatar_url: user.user_metadata.avatar_url,
        full_name: user.user_metadata.name,
        id: user.id,
        updated_at: null,
        username: user.user_metadata.name,
        website: null,
    } as Profile
}