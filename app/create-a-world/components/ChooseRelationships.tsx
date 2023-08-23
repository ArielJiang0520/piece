'use client'
import { useFormikContext } from 'formik';
import type { WorldPayload, Relationship } from "@/types/types";
import SearchBar from "@/components/ui/input/SearchBar";
import { TagsBar } from "@/components/ui/input/tags-helpers";
import { useEffect, useState } from 'react';
import { fetch_all_relationships, fetch_relationships_of_fandom } from '@/utils/data-helpers';

export default function ChooseRelationships() {
    const { setFieldValue, values } = useFormikContext<WorldPayload>();
    const [ships, setShips] = useState<Relationship[]>([]);
    const fetchShips = async () => {
        if (values.origin)
            setShips(await fetch_relationships_of_fandom(values.origin));
    }

    useEffect(() => {
        fetchShips();
    }, [values.origin])

    return <>
        <SearchBar
            candidates={ships}
            nameKey="name"
            placeholder="Add your ship (e.g. John Smith/Jane Doe)"
            onSelect={(ship: Relationship) => {
                !values.relationships.includes(ship.name) &&
                    setFieldValue('relationships', [...values.relationships, ship.name])
            }}
            allowCreatingNew={true}
        />
        <TagsBar
            values={values.relationships}
            handleValuesChange={(values: any) => setFieldValue('relationships', values)}
        />
    </>
}