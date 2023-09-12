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
export type Subscription = Database['public']['Tables']['subscriptions']['Row']

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

// For WorldCard Display
export interface JoinedWorldAll extends World {
    profiles: Profile | null,
    fandoms: Fandom | null,
    subscriptions: any[],
    pieces: any[],
}

export type PieceSettings = {
    NSFW: boolean,
    allowComments: boolean;
}

export type PiecePayload = {
    name: string,
    tags: string[],
    content: string,
    folder_id: string | null,
    images: string[],
    settings: PieceSettings
}

export interface DefaultPiece {
    id: string,
    name: string,
    default: boolean
}

export const PieceSettingsAsks = {
    NSFW: "Contains NSFW Content",
    allowComments: "Allow comments from other users"
}

export const EmptyPiecePayload: PiecePayload = {
    name: "",
    tags: [],
    content: "",
    folder_id: null,
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
        name: payload.name,
        tags: payload.tags,
        content: payload.content,
        images: payload.images,
        folder_id: payload.folder_id,
        nsfw: payload.settings.NSFW,
        allow_comments: payload.settings.allowComments,
    } as Piece
}

export function cast_to_piecepayload(piece: Piece): PiecePayload {
    return {
        name: piece.name,
        tags: piece.tags,
        content: piece.content,
        images: piece.images,
        folder_id: piece.folder_id,
        settings: {
            NSFW: piece.nsfw,
            allowComments: piece.allow_comments,
        }
    } as PiecePayload
}



export interface JoinedWorldPiece extends Piece {
    worlds: { name: string } | null
}

export interface JoinedAuthorPiece extends Piece {
    profiles: Profile | null
}

export interface JoinedProfile extends Profile {
    pieces: any[],
    worlds: any[],

}

export interface DefaultFolder {
    id: string,
    folder_name: string,
    default: boolean
}


export const EmptyFandom: Fandom = {
    name: '',
    aliases: [],
    media_type: '',
    num_of_worlds: 0,
    created_at: '',
    id: ''
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