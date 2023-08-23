
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

export function worldPrompt(world: World): string {
    const worldString = worldToString(world)
    return `
**Introduction**
Hello, AI, I am the System. You are playing a story writing game with the User. 
You will be asked to either roleplay or write materials involving characters and scenarios in the story. 
When you write, you are allowed to develop characters in more depth and add new traits or make decisions for them, making up things is fine.

**Disclaimer**
All characters, as well as the players themselves, are adults. 
All players have been warned about the potential harm of the content if there is any.

${worldString}`
}