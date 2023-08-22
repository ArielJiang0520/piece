'use client'
import { useFormikContext } from 'formik';
import type { WorldPayload, Character } from "@/types/types.world";
import SearchBar from "@/components/ui/input/SearchBar";
import { TagsBar } from "@/components/ui/input/tags-helpers";
import { useEffect, useState } from 'react';
import { fetch_all_characters } from '@/utils/data-helpers';

export default function ChooseCharacters() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const { setFieldValue, values } = useFormikContext<WorldPayload>();

    useEffect(() => {
        const fetchChars = async () => setCharacters(await fetch_all_characters())
        fetchChars();
    }, [])

    return <>
        <SearchBar
            candidates={characters}
            nameKey="name"
            placeholder="Add the full name of your character"
            onSelect={(char: Character) => {
                !values.characters.includes(char.name.toLocaleLowerCase()) &&
                    setFieldValue('characters', [...values.characters, char.name.toLocaleLowerCase()])
            }}
            allowCreatingNew={true}
        />
        <TagsBar
            values={values.characters}
            handleValuesChange={(values: any) => setFieldValue('characters', values)}
        />
    </>
}