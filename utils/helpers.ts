import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cache } from 'react';
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import moment from 'moment';
import { World } from "@/types/types";
import { encode } from "gpt-tokenizer";
import { worldToString } from "@/utils/prompt";

export const createClientSupabaseClient = cache(() =>
    createClientComponentClient<Database>()
);

export const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:3000/';
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url;
};

export const getId = () => {
    const randomNumber = Math.floor(Math.random() * 99999999) + 1
    return String(randomNumber).padStart(8, '0')
}

export function saveToLocalStorage(key: string, value: any) {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
}

export function getFromLocalStorage<T>(key: string): any | null {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null)
            return null;
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        return null;
    }
}



export function titleCase(str: string, delimiter: string = '/'): string {
    return str.split(delimiter)
        .map(subStr =>
            subStr.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
        )
        .join(delimiter);
}


export function renameKeyInObjectsArray(
    objectsArray: any[],
    existingKey: string,
    newKey: string
): any[] {
    return objectsArray.map((obj) => {
        if (existingKey in obj) {
            const { [existingKey]: value, ...rest } = obj;
            return { ...rest, [newKey]: value };
        }
        return obj;
    });
}

export function getDistanceToNow(timestamp: string): string {
    const date = new Date(timestamp);
    let result = formatDistanceToNowStrict(date, { addSuffix: false });
    return result + ' ago'
}

export function formatTimestamp(timestamp: string | null, dateOnly: boolean = false): string {
    if (!timestamp)
        return ""
    // Parse the timestamp into a Date object.
    const date = new Date(timestamp);

    // Define a helper function to pad single digit numbers with a leading zero.
    const padNumber = (num: number) => num < 10 ? '0' + num : num;

    // Extract the components of the date and time.
    const year = date.getUTCFullYear();
    const month = padNumber(date.getUTCMonth() + 1); // Months are 0-based in JavaScript.
    const day = padNumber(date.getUTCDate());
    const hours = padNumber(date.getUTCHours());
    const minutes = padNumber(date.getUTCMinutes());

    // Format the date and time.
    if (!dateOnly)
        return `${month}/${day} ${hours}:${minutes}`;
    else
        return `${month}/${day}/${year}`
}

export function getDistanceToNowAbbr(timestamp: string): string {
    let timestampDate = new Date(timestamp);
    let timeElapsed = moment.duration(moment(Date.now()).diff(moment(timestampDate)));

    if (timeElapsed.asYears() >= 1) {
        return Math.floor(timeElapsed.asYears()) + 'y';
    } else if (timeElapsed.asMonths() >= 1) {
        return Math.floor(timeElapsed.asMonths()) + 'm';
    } else if (timeElapsed.asDays() >= 1) {
        return Math.floor(timeElapsed.asDays()) + 'd';
    } else if (timeElapsed.asHours() >= 1) {
        return Math.floor(timeElapsed.asHours()) + 'h';
    } else {
        return Math.floor(timeElapsed.asMinutes()) + 'min';
    }
}

// await sleep(10000); // Sleep for 10 seconds
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function groupByKey(items: any[], groupByKey: string): { [key: string]: any[] } {
    return items.reduce((acc, item) => {
        const key = item[groupByKey];

        // Skip items where key is null
        if (key === null || key === undefined) {
            return acc;
        }

        // Ensure that the key exists in the accumulator
        if (!acc[key]) {
            acc[key] = [];
        }

        // Push the current item to the group
        acc[key].push(item);

        return acc;
    }, {});
}

export function createLookupTable(items: any[]): { [id: string]: any } {
    return items.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {} as { [id: string]: any });
}

export function cleanTags(strings: string[]): string[] {
    // 1. Convert to lowercase
    const lowercased = strings.map(str => str.toLowerCase());

    // 2. Strip off extra whitespace
    const strippedWhitespace = lowercased.map(str => str.trim());

    // 3. Remove duplicates
    const uniqueStrings: string[] = [];
    strippedWhitespace.forEach(str => {
        if (!uniqueStrings.includes(str)) {
            uniqueStrings.push(str);
        }
    });

    return uniqueStrings;
}

export function capitalize(s: string): string {
    return s.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export function getWorldNumTokens(world: World): number {
    return encode(worldToString(world)).length
}

export function getStringNumTokens(str: string): number {
    return encode(str).length
}

const GPT3_INPUT = 0.003
const GPT3_OUTPUT = 0.004
const GPT4_INPUT = 0.06
const GPT4_OUTPUT = 0.12

export function getGeneratePrice(numTokens: number, model: number): number {
    const totalTokens = numTokens + 100
    const estOutput = 800
    let price = 0
    if (model === 3) {
        price = (totalTokens / 1000 * GPT3_INPUT) + (estOutput / 1000 * GPT3_OUTPUT)
    } else {
        price = (totalTokens / 1000 * GPT4_INPUT) + (estOutput / 1000 * GPT4_OUTPUT)
    }
    return Number(price.toFixed(3))
}

export function getPiecePrice(numWorldTokens: number, numPieceTokens: number, model: number): number {
    let price = 0
    if (model === 3) {
        price = (numWorldTokens / 1000 * GPT3_INPUT) + (numPieceTokens / 1000 * GPT3_OUTPUT)
    } else {
        price = (numWorldTokens / 1000 * GPT4_INPUT) + (numPieceTokens / 1000 * GPT4_OUTPUT)
    }
    return Number(price.toFixed(3))
}

export const MODELS: { [key: string]: string } = {
    "deepseek-v3.2": "deepseek-v3p2",
    "deepseek-v3.1-terminus": "deepseek-v3p1-terminus",
    "deepseek-v3.1": "deepseek-v3p1",
    "deepseek-v3": "deepseek-v3-0324",
}
