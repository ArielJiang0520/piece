export type WorldDescriptionSectionCard = {
    cardTitle: string,
    cardContent: string
}

export type WorldDescriptionSection = {
    sectionTitle: string,
    sectionCards: WorldDescriptionSectionCard[]
}

export type WorldSettings = {
    NSFW: boolean,
    allowContribution: boolean,
    allowSuggestion: boolean,
}

export const WorldSettingsAsks = {
    NSFW: "NSFW Content",
    allowContribution: "Allow contribution from other users",
    allowSuggestion: "Allow suggestions from other users",
}

export type WorldPayload = {
    title: string,
    logline: string,
    tags: string[],
    description: WorldDescriptionSection[],
    settings: WorldSettings
}



export const initValues: WorldPayload = {
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
`
                }
            ]
        },
        {
            sectionTitle: "Story Premise",
            sectionCards: []
        }
    ],
    settings: {
        NSFW: false,
        allowContribution: true,
        allowSuggestion: true,
    }
}