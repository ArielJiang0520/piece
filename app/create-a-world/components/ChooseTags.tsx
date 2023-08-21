'use client'
import { useFormikContext } from 'formik';
import type { Tag, WorldPayload } from "@/types/types.world";
import { CategoriesSwitchTab } from "@/components/ui/switch-tab/switch-tab";
import { groupByKey } from "@/utils/helpers";
import SearchBar from "@/components/ui/input/SearchBar";
import { TagsBar } from "@/components/ui/input/tags-helpers";
import { useData } from '@/app/data-providers';

export default function ChooseTags({ }: {}) {
    const { setFieldValue, values } = useFormikContext<WorldPayload>();
    const { tags, tagsCategories } = useData();

    return <>
        <CategoriesSwitchTab
            categories={tagsCategories}
            items={groupByKey(tags, 'category')}
            selected={values.tags}
            handleSelect={(tags: string[]) => { setFieldValue('tags', tags) }}
        />
        <SearchBar
            candidates={tags.map((tag, idx) => { return { ...tag, id: idx } })}
            nameKey="name"
            placeholder="Or add your own tag"
            onSelect={(tag: Tag) => {
                if (!values.tags.map(t => t.toLocaleLowerCase()).includes(tag.name.toLocaleLowerCase()))
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
