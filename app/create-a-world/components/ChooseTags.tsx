'use client'
import { useFormikContext } from 'formik';
import { TagCategory, type Tag, type WorldPayload } from "@/types/types";
import { CategoriesSwitchTab } from "@/components/ui/switch-tab/switch-tab";
import { groupByKey } from "@/utils/helpers";
import SearchBar from "@/components/ui/input/SearchBar";
import { TagsBar } from "@/components/ui/input/tags-helpers";
import { useEffect, useState } from 'react';
import { fetch_all_tags, fetch_all_tags_categories } from '@/utils/data-helpers';


export default function ChooseTags({ }: {}) {
    const { setFieldValue, values } = useFormikContext<WorldPayload>();
    const [tags, setTags] = useState<Tag[]>([])
    const [categories, setCategories] = useState<TagCategory[]>([])

    useEffect(() => {
        const fetchData = async () => {
            setTags(await fetch_all_tags());
            setCategories(await fetch_all_tags_categories());
        }
        fetchData();
    }, [])

    return <>
        <CategoriesSwitchTab
            categories={categories}
            items={groupByKey(tags, 'category')}
            selected={values.tags}
            handleSelect={(tag: Tag) => {
                values.tags.includes(tag.name) ?
                    setFieldValue('tags', values.tags.filter(item_name => item_name != tag.name))
                    : setFieldValue('tags', [...values.tags, tag.name])
            }
            }
        />
        <SearchBar
            candidates={tags}
            nameKey="name"
            placeholder="Or add your own tag"
            onSelect={(tag: Tag) => {
                !values.tags.includes(tag.name) &&
                    setFieldValue('tags', [...values.tags, tag.name])
            }}
            allowCreatingNew={true}
        />
        <TagsBar
            values={values.tags}
            handleValuesChange={(tags: string[]) => setFieldValue('tags', tags)}
        />
    </>
}
