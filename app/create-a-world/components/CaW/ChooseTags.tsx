'use client'
import { useFormikContext } from 'formik';
import { type Tag, type WorldPayload } from "@/types/types";
import { CategoriesSwitchTab } from "@/components/ui/menu/switch-tab";
import { groupByKey } from "@/utils/helpers";
import SearchBar from "@/components/ui/input/SearchBar";
import { TagsBar } from "@/components/ui/input/tags-helpers";
import { useDraftContext } from '../../draft-provider';

export default function ChooseTags({ }: {}) {
    const { setFieldValue, values } = useFormikContext<WorldPayload>();
    const { tags, categories } = useDraftContext();
    return <>
        <CategoriesSwitchTab
            categories={categories.filter(cat => cat.name !== "Genres")}
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
