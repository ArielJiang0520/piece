import { User } from "@supabase/supabase-js"
import { Database, Json } from "./supabase"

export type World = Database['public']['Tables']['worlds']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Piece = Database['public']['Tables']['pieces']['Row']
export type Folder = Database['public']['Tables']['folders']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type TagCategory = Database['public']['Tables']['tags_categories']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Like = Database['public']['Tables']['likes']['Row']

export type WorldDescriptionSectionCard = {
    cardTitle: string,
    cardContent: string,
    cardImages: string[],
    isCharacterCard: boolean
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

export type WorldPayload = {
    genre1: string | null,
    genre2: string | null,
    tags: string[],

    images: string[],
    name: string,
    logline: string,
    description: WorldDescriptionSection[],
    settings: WorldSettings
}

export const EmptyWorldPayload: WorldPayload = {
    genre1: null,
    genre2: null,
    tags: [],
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

//////////////////////////////////////////////////////////
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


export type GenPieceJson = {
    prompt: string;
    output: string;
    notes: string;
}

export type ChatHistoryJson = {
    userRole: string,
    aiRole: string,
    scenario: string,
    output: Array<{ role: string, content: string }>
    notes: string;
}

export type GeneralJson = {
    content: string,
    images: string[]
}

export type TypedPiece = {
    name: string;
    world_id: string;
    type: 'gen-piece' | 'roleplay';
    json_content: GenPieceJson | ChatHistoryJson,
    tags: string[],
    folder_id: string | null,
}


export interface DefaultFolder {
    id: string,
    name: string,
    pieces: any[],
    created_at: string,
}

