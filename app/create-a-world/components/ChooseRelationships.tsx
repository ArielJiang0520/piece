'use client'
import { useFormikContext } from 'formik';
import type { WorldPayload, Relationship } from "@/types/types.world";
import SearchBar from "@/components/ui/input/SearchBar";
import { TagsBar } from "@/components/ui/input/tags-helpers";
import { useEffect, useState } from 'react';
import { fetch_all_relationships } from '@/utils/data-helpers';

export default function ChooseRelationships() {
    const { setFieldValue, values } = useFormikContext<WorldPayload>();
    const [ships, setShips] = useState<Relationship[]>([]);

    useEffect(() => {
        const fetchShips = async () => setShips(await fetch_all_relationships());
        fetchShips();
    })

    return <>
        <SearchBar
            candidates={ships.map((ship, idx) => { return { ...ship, id: idx } })}
            nameKey="name"
            placeholder="Add your ship (e.g. John Smith/Jane Doe)"
            onSelect={(ship: Relationship) => {
                !values.relationships.includes(ship.name.toLocaleLowerCase()) &&
                    setFieldValue('relationships', [...values.relationships, ship.name.toLocaleLowerCase()])
            }}
            allowCreatingNew={true}
        />
        <TagsBar
            values={values.relationships}
            handleValuesChange={(values: any) => setFieldValue('relationships', values)}

        />
    </>
}