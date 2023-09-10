import { JoinedWorldAll, Profile, World } from "@/types/types";
import { CalendarIcon } from "@/components/icon/icon";
import { formatTimestamp } from "@/utils/helpers";
import Image from "next/image";
import { FieldContentDisplay } from "./display-helpers";
import { Piece } from "@/types/types";


export const PieceAuthorDisplay = ({ author }: { author: Profile }) => {
    return <div className="flex flex-row w-full max-w-md justify-start items-start space-x-4 text-foreground text-xs border py-4 px-3 font-mono">
        <div>
            <Image
                className='rounded-full'
                src={author.avatar_url ? author.avatar_url : 'logo_500px.png'}
                alt={"profile picture"}
                width={32} height={32}
                onClick={() => { }}
            />
        </div>
        <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-col ">
                <div className="font-semibold">{author?.full_name ? author.full_name : "Deleted User"}</div>

                <div>{"123 followers"}</div>

            </div>
            <div className="flex bg-foreground/5 rounded-lg py-2 px-4 text-sm cursor-pointer">
                Follow Creator +
            </div>
        </div>
    </div>
}