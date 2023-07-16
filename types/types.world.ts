export type WorldDescriptionSectionCard = {
    cardTitle: string,
    cardContent: string
}

export type WorldDescriptionSection = {
    sectionTitle: string,
    sectionCards: WorldDescriptionSectionCard[]
    // [{"premise": [card1, card2, card3, ... ]}]
}

export type WorldSettings = {
    NSFW: boolean,
    allowContribution: boolean,
    allowSuggestion: boolean,
}

export type WorldPayload = {
    title: string,
    logline: string,
    tags: string[],
    description: WorldDescriptionSection[],
    coverImage: string,
    setting: WorldSettings | null
}
