import { PlusCircleIcon, MinusIcon } from "@/components/icon/icon";

export const SectionCard = ({ index, title, content, onclick, ondel }: { index: number, title: string, content: string, onclick: (arg: number) => void, ondel: (arg: number) => void }) => {
    return (
        <div id='card'
            className='relative flex-shrink-0 p-8 flex flex-col justify-start items-center space-y-2 border-2 cursor-pointer rounded-lg w-64 h-64'
            onClick={() => onclick(index)}
        >
            <div>
                <MinusIcon
                    className='absolute top-2 right-2 w-5 h-5 text-foreground/20'
                    onClick={(event) => {
                        event.stopPropagation();
                        ondel(index)
                    }}
                />
            </div>

            <div className='text-center leading-snug text-2xl overflow-hidden overflow-ellipsis whitespace-nowrap w-full h-12'>
                {title}
            </div>

            <div className='w-full border-b-2 h-px'></div>

            <div className='text-xs text-left overflow-hidden overflow-ellipsis h-48 w-full whitespace-pre-line'>
                {content}
            </div>
        </div>
    )
}


export const NewSectionCard = ({ onclick }: { onclick: () => void }) => {
    return (
        <div className='flex-shrink-0 flex flex-col justify-center items-center space-y-2 border-2 cursor-pointer rounded-lg w-64 h-64'
            onClick={onclick}>
            <div>
                <PlusCircleIcon
                    size={40}
                    className='text-foreground/20'
                />
            </div>
            <div className='font-mono text-sm text-foreground/20'>
                Add New Card
            </div>
        </div>
    )
}