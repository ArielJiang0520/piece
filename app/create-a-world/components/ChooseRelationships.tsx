'use client'
import { useFormikContext } from 'formik';
import type { WorldPayload, Character, Relationship } from "@/types/types.world";
import SearchBar from "@/components/ui/input/SearchBar";
import { TagsBar } from "@/components/ui/input/tags-helpers";
import { useData } from '@/app/data-providers';


export default function ChooseRelationships() {
    const { setFieldValue, values } = useFormikContext<WorldPayload>();
    const { relationships } = useData();

    return <>
        <SearchBar
            candidates={relationships.map((ship, idx) => { return { ...ship, id: idx } })}
            nameKey="name"
            placeholder="Add your ship (e.g. John Smith/Jane Doe)"
            onSelect={(relationship: Relationship) => {
                if (!values.relationships.map(ship => ship.toLocaleLowerCase()).includes(relationship.name.toLocaleLowerCase()))
                    setFieldValue('relationships', [...values.relationships, relationship.name])
            }}
            allowCreatingNew={true}
        />
        <TagsBar
            values={values.relationships}
            handleValuesChange={(values: any) => setFieldValue('relationships', values)}

        />
    </>
}