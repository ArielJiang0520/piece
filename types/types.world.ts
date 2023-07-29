import { Database } from "./supabase"

export type World = Database['public']['Tables']['worlds']['Row']
export type Draft = Database['public']['Tables']['drafts']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Piece = Database['public']['Tables']['pieces']['Row']

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

export type WorldPayload = {
    origin: string | null,
    images: string[],
    title: string,
    logline: string,
    tags: string[],
    description: WorldDescriptionSection[],
    settings: WorldSettings
}

export const EmptyWorldPayload: WorldPayload = {
    origin: null,
    images: [],
    title: "",
    logline: "",
    tags: [],
    description: [],
    settings: {
        public: true,
        NSFW: false,
        allowContribution: true,
        allowSuggestion: true,
    }
}

export function cast_to_worldpayload(world: World | Draft) {
    return {
        origin: world.origin,
        images: world.images,
        title: world.world_name,
        logline: world.logline,
        tags: world.tags,
        description: world.description as WorldDescriptionSection[],
        settings: {
            public: world.public,
            NSFW: world.nsfw,
            allowContribution: world.allow_contribution,
            allowSuggestion: world.allow_suggestion,
        }
    } as WorldPayload
}

export function cast_to_world(payload: WorldPayload, creator_id: string | null, created_at: string) {
    return {
        allow_contribution: payload.settings.allowContribution,
        allow_suggestion: payload.settings.allowSuggestion,
        created_at: created_at,
        creator_id: creator_id,
        description: payload.description,
        id: '',
        images: payload.images,
        logline: payload.logline,
        modified_at: created_at,
        nsfw: payload.settings.NSFW,
        origin: payload.origin,
        public: payload.settings.public,
        tags: payload.tags,
        world_name: payload.title,
    } as World
}

export const initValues: WorldPayload = {
    origin: null,
    images: [],
    title: 'Silicon Valley Psychos',
    logline: `The resilient yet financially struggling Linus, grappling with his uncompromising principles against corporate greed,  was faced with an offer from Wynn - the man who once betrayed him`,
    tags: ["BL", "Tech", "Power Dynamics"],
    description: [
        {
            sectionTitle: "Backdrop",
            sectionCards: []
        },
        {
            sectionTitle: "Characters",
            sectionCards: [
                {
                    cardTitle: 'Linus',
                    cardContent: `Background: High school computer science teacher in a Fremont suburb, co-founder of WinLin, and a Stanford graduate. Previously a tech entrepreneur, he chose a simpler life due to disillusionment with corporate greed.
Appearance: Medium height with unkempt dark curly hair, big eyes, and an often rugged appearance due to his simple and functional clothing. But underneath his scruffiness is a cute face and a pale, fragile yet appealing body
Personality: Intellectually curious, introverted, genuine, and dedicated, with a strong ethical stand against commercial exploitation of knowledge and technology. Has a tendency to suppress emotions and desires and play coy
`,
                    cardImages: []
                }
            ]
        },
        {
            sectionTitle: "Story Premise",
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