'use client'
import { useFormikContext } from 'formik';
import type { WorldPayload, Character } from "@/types/types.world";
import SearchBar from "@/components/ui/input/SearchBar";
import { TagsBar } from "@/components/ui/input/tags-helpers";
import { useData } from '@/app/data-providers';


export default function ChooseCharacters() {
    const { setFieldValue, values } = useFormikContext<WorldPayload>();
    const { characters } = useData();

    return <>
        <SearchBar
            candidates={characters.map((char, idx) => { return { ...char, id: idx } })}
            nameKey="name"
            placeholder="Add the full name of your character"
            onSelect={(character: Character) => {
                if (!values.characters.map(char => char.toLocaleLowerCase()).includes(character.name.toLocaleLowerCase()))
                    setFieldValue('characters', [...values.characters, character.name])
            }}
            allowCreatingNew={true}
        />
        <TagsBar
            values={values.characters}
            handleValuesChange={(values: any) => setFieldValue('characters', values)}
        />
    </>
}