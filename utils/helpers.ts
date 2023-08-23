import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cache } from 'react';

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

export const postData = async ({
    url,
    data
}: {
    url: string;
    data: any;
}) => {
    console.log('posting,', url, data);

    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({
            data: data
        })
    });

    if (!res.ok) {
        console.log('Error in postData', { url, data, res });
        throw Error(res.statusText);
    }

    return res.json();
};

export const updateData = async ({
    url,
    data,
    id,
}: {
    url: string;
    data: any;
    id: string;
}) => {
    console.log('updating,', url, data, 'at', id);

    const res = await fetch(url, {
        method: 'PUT',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({
            data: data,
            id: id
        })
    });

    if (!res.ok) {
        console.log('Error in updateData', { url, data, id, res });
        throw Error(res.statusText);
    }

    return res.json();
}

export const deleteData = async ({
    url,
    id,
}: {
    url: string;
    id: string;
}) => {
    console.log('deleting,', url, 'at', id);

    const res = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({
            id: id
        })
    });

    if (!res.ok) {
        console.log('Error in deleteData', { url, id, res });
        throw Error(res.statusText);
    }

    return res.json();
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