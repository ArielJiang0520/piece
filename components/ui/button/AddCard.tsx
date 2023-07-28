
import { PlusCircleIcon } from "@/components/icon/icon";

interface AddCardProps {
    text: string;
    width: string;
    height: string;
    onclick: () => void,
}

const AddCard = ({ text, width, height, onclick }: AddCardProps) => {
    return (
        <div className={`flex-shrink-0 flex flex-col justify-center items-center space-y-2 border-2 cursor-pointer rounded-lg ${width} ${height}`}
            onClick={onclick}>
            <div>
                <PlusCircleIcon
                    size={40}
                    className='text-foreground/20'
                />
            </div>
            <div className='font-mono text-sm text-foreground/20'>
                {text}
            </div>
        </div>
    )
}

export default AddCard;