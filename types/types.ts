import { getId } from "@/utils/helpers"
import { Database } from "./supabase"

export type World = Database['public']['Tables']['worlds']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Piece = Database['public']['Tables']['pieces']['Row']
export type Folder = Database['public']['Tables']['folders']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type TagCategory = Database['public']['Tables']['tags_categories']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Like = Database['public']['Tables']['likes']['Row']
export type Prompt = Database['public']['Tables']['prompts']['Row']
export type PromptHistory = Database['public']['Tables']['prompt_history']['Row']
export type Modifier = Database['public']['Tables']['modifiers']['Row']

export type WorldDescriptionSectionCard = {
    id: string
    cardTitle: string,
    cardContent: string,
    cardImages: string[],
    isCharacterCard: boolean
}

export type WorldDescriptionSection = {
    id: string,
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

export const WorldProgress = [
    {
        id: "actively updating",
        name: "Actively Updating",
    },
    {
        id: "infrequent updating",
        name: "Infrequent/Passive Updating"
    },
    {
        id: "stopped updating",
        name: "On Hiatus (unfinished)"
    },
    {
        id: "done",
        name: "Finished"
    },
]


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
    settings: WorldSettings,
    progress: 'actively updating' | 'stopped updating' | 'infrequent updating',
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
            id: getId(),
            sectionTitle: "Premise",
            sectionCards: []
        },
        {
            id: getId(),
            sectionTitle: "Characters",
            sectionCards: []
        },
        {
            id: getId(),
            sectionTitle: "Additional Settings",
            sectionCards: []
        }
    ],
    settings: {
        public: true,
        NSFW: false,
        allowContribution: true,
        allowSuggestion: true,
    },
    progress: 'actively updating'
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
    model: string | null;
    notes: string;
    prequel: string | null;
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

