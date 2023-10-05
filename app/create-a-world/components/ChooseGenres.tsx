'use client'
import { useFormikContext } from 'formik';
import type { WorldPayload, Tag } from "@/types/types";
import SearchBar from "@/components/ui/input/SearchBar";
import { useDraftContext } from '../draft-provider';

const GenreID = "21f332f3-15e0-43ab-819d-21889002a7e1"
export default function ChooseGenres() {
    const { tags } = useDraftContext();
    const { setFieldValue, values } = useFormikContext<WorldPayload>();

    return <div className='flex flex-row space-x-6 max-w-2xl'>
        <SearchBar
            candidates={tags.filter(tag => tag.category === GenreID)}
            nameKey="name"
            placeholder="Select Primary Genre"
            onSelect={(genre: Tag) => {
                setFieldValue('genre1', genre.id);
            }}
            defaultSelectedId={values.genre1}
            hasReset={false}
        />
        <SearchBar
            candidates={tags.filter(tag => tag.category === GenreID)}
            nameKey="name"
            placeholder="Select Secondary Genre"
            onSelect={(genre: Tag) => {
                setFieldValue('genre2', genre.id);
            }}
            defaultSelectedId={values.genre2}
            hasReset={false}
        />
    </div>
}