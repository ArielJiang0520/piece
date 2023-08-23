'use client'
import { useFormikContext } from 'formik';
import { Tag, PiecePayload } from "@/types/types";
import SearchBar from "@/components/ui/input/SearchBar";
import { TagsBar } from "@/components/ui/input/tags-helpers";
import { useEffect, useState } from 'react';
import { fetch_all_tags } from '@/utils/data-helpers';

export default function ChooseTags({ }: {}) {
    const { setFieldValue, values } = useFormikContext<PiecePayload>();
    const [tags, setTags] = useState<Tag[]>([])

    useEffect(() => {
        const fetchData = async () => {
            setTags(await fetch_all_tags());
        }
        fetchData();
    }, [])

    return <>
        <SearchBar
            candidates={tags}
            nameKey="name"
            placeholder="Add tags"
            onSelect={(tag: Tag) => {
                !values.tags.includes(tag.name.toLocaleLowerCase()) &&
                    setFieldValue('tags', [...values.tags, tag.name.toLocaleLowerCase()])
            }}
            allowCreatingNew={true}
        />
        <TagsBar
            values={values.tags}
            handleValuesChange={(tags: string[]) => setFieldValue('tags', tags)}
        />
    </>
}
