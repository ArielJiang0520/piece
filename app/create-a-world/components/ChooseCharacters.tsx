'use client'
import { useFormikContext } from 'formik';
import type { WorldPayload, Character } from "@/types/types";
import SearchBar from "@/components/ui/input/SearchBar";
import { TagsBar } from "@/components/ui/input/tags-helpers";
import { useEffect, useState } from 'react';
import { fetch_characters_of_fandom } from '@/utils/data-helpers';

export default function ChooseCharacters() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const { setFieldValue, values } = useFormikContext<WorldPayload>();
    const fetchChars = async () => {
        if (values.origin)
            setCharacters(await fetch_characters_of_fandom(values.origin))
    }

    useEffect(() => {
        fetchChars();
    }, [values.origin])

    return <>
        <SearchBar
            candidates={characters}
            nameKey="name"
            placeholder="Add the full name of your character"
            onSelect={(char: Character) => {
                !values.characters.includes(char.name) &&
                    setFieldValue('characters', [...values.characters, char.name])
            }}
            allowCreatingNew={true}
        />
        <TagsBar
            values={values.characters}
            handleValuesChange={(values: any) => setFieldValue('characters', values)}
        />
    </>
}