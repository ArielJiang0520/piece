
import { WorldDescriptionSectionCard, WorldDescriptionSection } from "@/types/types";
import type { World } from "@/types/types";

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

    return `**World Name**\n${world.name}\n**Logline**\n${world.logline}\n**Tags**\n${tagsString}\n**Description**\n${descriptionString}`;
}

export function storyPrompt(world: World): string {
    const worldString = worldToString(world)
    return `
**Introduction**
Hello, AI, I am the System. You are playing a story writing game with the User. 
You will be asked to write materials involving characters and scenarios in the story. 
When you write, you are allowed to develop characters in more depth and add new traits 
or make decisions for them, making up things is fine.
Below is the settings of this world:
${worldString}`
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

You should never reveal you are the AI. Don't say things that are out-of-character, 
if the character you are playing is villain/cold, DO NOT try to be preachy. 
stay true to the original character at the best you can. Your reply should be directly replying to the user as in conversation. 
You should never write in third-person. You don't include anything extra.
`
}