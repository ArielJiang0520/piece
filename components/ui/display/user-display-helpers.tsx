import type { User } from "@supabase/supabase-js";
import { CalendarIcon } from "@/components/icon/icon";
import { formatTimestamp } from "@/utils/helpers";
import Image from "next/image";
import { FieldContentDisplay } from "./display-helpers";
import { Piece } from "@/types/types.world";

export const PieceAuthorDisplay = ({ user, piece }: { user: User, piece: Piece }) => {
    return <div className="flex flex-row justify-start items-start space-x-4 text-foreground text-xs">
        <div>
            <Image
                className='rounded-full'
                src={user.user_metadata.picture}
                alt={"profile picture"}
                width={32} height={32}
                onClick={() => { }}
            />
        </div>
        <div className="flex flex-col font-mono ">
            <div className="font-semibold">{user.user_metadata.full_name}</div>
            <div className='flex flex-row justify-start items-center space-x-1'>
                <CalendarIcon />
                <span>Created on {formatTimestamp(piece.created_at, true)}</span>
            </div>
        </div>
    </div>
}