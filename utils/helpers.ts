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
        body: JSON.stringify(data)
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


export function formatTimestamp(timestamp: string | null): string {
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
    const formattedDate = `${month}/${day} ${hours}:${minutes}`;

    return formattedDate;
}

// await sleep(10000); // Sleep for 10 seconds
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}