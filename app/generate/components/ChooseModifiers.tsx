'use client'
import { useFormikContext } from 'formik';
import { Modifier } from "@/types/types";
import { PromptPayload } from './Generate';
import { useEffect, useState } from 'react';
import { groupByKey } from "@/utils/helpers";
import SearchBar from "@/components/ui/input/SearchBar";
import { TagsBar } from "@/components/ui/input/tags-helpers";
import { fetch_all_modifiers } from '@/utils/modifier-helpers';


export default function ChooseModifiers({ }: {}) {
    const { setFieldValue, values } = useFormikContext<PromptPayload>();
    const [modifiers, setModifiers] = useState([] as Modifier[]);

    useEffect(() => {
        const fetchData = async () => setModifiers(await fetch_all_modifiers());
        fetchData();
    }, [])

    return <>

        <SearchBar
            candidates={modifiers}
            nameKey="name"
            placeholder="Add modifiers"
            onSelect={(sel: Modifier) => {
                for (const mod of values.modifiers) {
                    if (mod.id === sel.id) {
                        return;
                    }
                }
                setFieldValue('modifiers', [...values.modifiers, sel])
            }}
        />
        <TagsBar
            values={values.modifiers}
            handleValuesChange={(modifiers: Modifier[]) => setFieldValue('modifiers', modifiers)}
            isString={false}
            nameKey='name'
        />
    </>
}
