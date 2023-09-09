'use client'
import useHorizontalDragScroll from "@/hooks/useHorizontalScroll";

interface TagsBarProps {
    values: string[];
    handleValuesChange: (values: any) => void;
}
export function TagsBar({ values, handleValuesChange }: TagsBarProps) {
    const handleRemoveTag = (idx: number) => {
        const newValues = values.filter((_, index) => index != idx);
        handleValuesChange(newValues)
    }

    return (
        <div className='my-2 pb-5 flex flex-row w-full justify-start flex-wrap'>
            {
                values.map((name, idx) =>
                    <button
                        key={idx}
                        type="button"
                        className='bg-foreground text-background text-xs font-semibold rounded-full px-3 py-2 whitespace-nowrap mr-1 mt-2'
                        onClick={() => handleRemoveTag(idx)}
                    >
                        {name}
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
    const { startDrag, stopDrag, doDrag } = useHorizontalDragScroll();
    return (
        <div className={`flex flex-row w-full justify-start  ${scroll ? "overflow-hidden overflow-x-auto horizontal-scroll hide-scrollbar" : "flex-wrap "}`}
            onMouseDown={startDrag}
            onMouseLeave={stopDrag}
            onMouseUp={stopDrag}
            onMouseMove={doDrag}>
            {
                tags.map((tag, index) =>
                    <button
                        key={index}
                        type="button"
                        disabled={preview}
                        className={`capitalize bg-foreground text-background text-xs font-medium rounded-full px-3 py-1 whitespace-nowrap mr-1 my-1 ${preview ? "cursor-auto" : ""}`}
                    >
                        {tag}
                    </button>
                )
            }
        </div>
    )
}


export function TagsBarSmallDisplay({ tags, small = false, scroll = false }: { tags: string[], small?: boolean, scroll?: boolean }) {
    return (
        <div className={`flex flex-row font-mono ${scroll ? "overflow-x-auto" : "flex-wrap"}`}>
            {
                tags.map((tag, index) =>
                    <div
                        key={index}
                        className={`capitalize border-foreground bg-foreground/10 text-foreground/70 whitespace-nowrap ${!small ? "text-sm  mr-2 mt-2 py-1 px-2" : "text-xs mr-1 py-1 px-2"} `}
                    >
                        {tag}
                    </div>
                )
            }
        </div>

    )
}


export function TagsBarTinyDisplay({ tags }: { tags: string[] }) {
    return (
        <div className={`flex flex-row w-full font-mono flex-wrap`}>
            {
                tags.map((tag, index) =>
                    <div
                        key={index}
                        className={`capitalize  text-foreground/70 whitespace-nowrap text-xs mr-1 mt-1`}
                    >
                        #{tag}
                    </div>
                )
            }
        </div>

    )
}