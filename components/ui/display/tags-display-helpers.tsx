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
                        className='bg-foreground text-background text-xs font-semibold rounded-full px-3 py-2 whitespace-nowrap '
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
    tags: string[],
    preview?: boolean,
    scroll?: boolean
}

export function TagsBarDisplay({ tags, preview = false, scroll = false }: TagsBarDisplay) {
    return (

        <div className={`flex flex-row w-full justify-start  ${scroll ? "overflow-hidden overflow-x-auto" : "flex-wrap "}`}>
            {
                tags.map((tag, index) =>
                    <button
                        key={index}
                        type="button"
                        disabled={preview}
                        className={`bg-foreground text-background text-xs font-medium rounded-full px-3 py-1 whitespace-nowrap mr-2 my-1 ${preview ? "cursor-auto" : ""}`}
                    >
                        {tag}
                    </button>
                )
            }
        </div>


    )
}


export function TagsBarSmallDisplay({ tags }: { tags: string[] }) {

    return (

        <div className='flex flex-row w-full space-x-2 justify-start overflow-hidden font-mono'>
            {
                tags.map((tag, index) =>
                    <div
                        key={index}
                        className='text-foreground/50 text-xs font-normal whitespace-nowrap'
                    >
                        #{tag}
                    </div>
                )
            }
        </div>

    )
}