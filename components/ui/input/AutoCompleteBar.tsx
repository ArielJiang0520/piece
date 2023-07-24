import React, { useState, useEffect } from 'react';

type Tag = {
    id: string;
    value: string;
    hits: number;
};

const tags = ['Hopeful', 'Romantic', 'Bittersweet',
    'Melancholic', 'Tense', 'Seductive', 'Humorous', 'Serious',
    'Anguished', 'Suspenseful', 'Nostalgic', 'Pensive', 'Dark', 'Dramatic']

const data: Tag[] = tags.map((tag, index) => ({ id: index.toString(), value: tag, hits: Math.floor(Math.random() * 100) + 1 }));


async function fetchTags(): Promise<Tag[]> {
    // Replace with your API endpoint.
    // const response = await fetch(`https://api.example.com/tags`);
    // const json = await response.json();
    // return json.data;
    return data
}

type AutocompleteBoxProps = {
    value: string[];
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
};

const AutocompleteBox: React.FC<AutocompleteBoxProps> = ({ value, setFieldValue }) => {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

    useEffect(() => {
        fetchTags().then(fetchedTags => {
            setTags(fetchedTags);
        });
    }, []);

    useEffect(() => {
        if (inputValue === '') {
            setFilteredTags([]);
        } else {
            const lowercasedInput = inputValue.toLowerCase();
            const newFilteredTags = tags
                .filter(tag => tag.value.toLowerCase().startsWith(lowercasedInput))
                .sort((a, b) => b.hits - a.hits);
            setFilteredTags(newFilteredTags);
        }
    }, [inputValue, tags]);

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            // event.preventDefault();
            setFieldValue('tags', [...value, inputValue]);
            setInputValue('');
        }
    };

    return (
        <>
            <input
                className='text-lg w-full singleLineInput'
                type="text"
                placeholder='Add your tags...'
                value={inputValue}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
            // list="autocomplete-options"
            />
            {/* <datalist id="autocomplete-options">
                {filteredTags.map((tag) => (
                    <option key={tag.id} value={tag.value} />
                ))}
            </datalist> */}

        </>
    );
};


export default AutocompleteBox;