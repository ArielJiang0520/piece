
import { WorldDescriptionSectionCard, WorldDescriptionSection } from "@/types/types";
import type { World, Piece, GeneralJson, GenPieceJson } from "@/types/types";

export function worldToString(world: World): string {
    let descriptionString = '';

    if (world.description) {
        (world.description as WorldDescriptionSection[]).forEach(section => {
            descriptionString += `${section.sectionTitle}:\n`;
            if (section.sectionCards.length > 0) {
                (section.sectionCards as WorldDescriptionSectionCard[]).forEach(card => {
                    descriptionString += `  ${card.cardTitle}:\n    ${card.cardContent}\n`;
                });
            } else {
                descriptionString += '  No details provided.\n';
            }
        });
    }

    const tagsString = world.tags.join(', ');

    return `**World Name**\n${world.name}\n**Summary**\n${world.logline}\n**Tags**\n${tagsString}\n**Description**\n${descriptionString}`;
}

export function storyPrompt(world: World, piece?: Piece | null): string {
    const worldString = worldToString(world)
    const piece_content = piece ? piece.piece_type === "original" ? (piece.piece_json as GeneralJson).content : (piece.piece_json as GenPieceJson).output : ""
    const prequelString = `The user has already written the following story as a context for you: ${piece_content}.`
    return `
Below is the settings of this novel/fictional story:
${worldString}
${prequelString}
`
}

export function roleplayPrompt(world: World, userRole: string, aiRole: string, scenario: string): string {
    const worldString = worldToString(world)
    return `
Below is the settings of this world:
${worldString}
=========================================
**Instruction**
Right now, you are playing as ${aiRole} in the story, 
while the user is playing as ${userRole}  in the story. 
The current scenario: ${scenario}.

You should never reveal you are the AI. 
You should act in-character, embodying all of their traits. Never be dull.
Your reply should be directly replying to the user as in conversation. 
You should never write in third-person. You don't include anything extra.
`
}

export function simulationPrompt(world: World, aiRole1: string, aiRole2: string, scenario: string): string {
    const worldString = worldToString(world)
    return `
Below is the settings of this world:
${worldString}
=========================================
**Instruction**
Right now, the user is playing as ${aiRole1}  in the story,
while  you are playing as ${aiRole2} in the story.
 
The current scenario: ${scenario}.

You should never reveal you are the AI. 
You should act in-character, embodying all of their traits. Never be dull.
Your reply should be directly replying to the user as in conversation. 
You should never write in third-person. 
`
}


