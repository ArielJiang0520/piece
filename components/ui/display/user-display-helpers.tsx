import { Profile } from "@/types/types";
import { CalendarIcon } from "@/components/icon/icon";
import { formatTimestamp } from "@/utils/helpers";
import Image from "next/image";
import { FieldContentDisplay } from "./display-helpers";
import { Piece } from "@/types/types";

export const PieceAuthorDisplay = ({ author }: { author: Profile }) => {
    return <div className="flex flex-row justify-start items-start space-x-4 text-foreground text-xs border p-4">
        <div>
            <Image
                className='rounded-full'
                src={author.avatar_url ? author.avatar_url : 'logo_500px.png'}
                alt={"profile picture"}
                width={32} height={32}
                onClick={() => { }}
            />
        </div>
        <div className="flex flex-col font-mono ">
            <div className="font-semibold">{author?.full_name ? author.full_name : "Deleted User"}</div>
            {/* <div className='flex flex-row justify-start items-center space-x-1'>
                <CalendarIcon />
                <span>Created on {formatTimestamp(piece.created_at, true)}</span>
            </div> */}
        </div>
    </div>
}