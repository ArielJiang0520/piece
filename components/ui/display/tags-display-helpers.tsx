interface TagsBarProps {
    tags: string[];
    setFieldValue: (field: string, value: any) => void;
}

export function TagsBar({ tags, setFieldValue }: TagsBarProps) {
    const handleRemoveTag = (index: number) => {
        const newTags = tags.filter((tag, i) => i !== index);
        setFieldValue('tags', newTags)
    }

    return (

        <div className='my-2 pb-5 flex flex-row w-full space-x-2 justify-start overflow-x-auto'>
            {
                tags.map((tag, index) =>
                    <button
                        key={index}
                        type="button"
                        className='bg-foreground text-background text-xs font-semibold rounded-full px-3 py-2'
                        onClick={() => handleRemoveTag(index)}
                    >
                        {tag}
                    </button>
                )
            }
        </div>

    )
}

interface TagsBarDisplay {
    tags: string[]
}

export function TagsBarDisplay({ tags }: TagsBarDisplay) {
    return (

        <div className='flex flex-row w-full space-x-2 justify-start'>
            {
                tags.map((tag, index) =>
                    <button
                        key={index}
                        type="button"
                        className='bg-foreground text-background text-xs font-semibold rounded-full px-3 py-2'
                    >
                        {tag}
                    </button>
                )
            }
        </div>

    )
}