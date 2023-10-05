import { Profile, World } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

export const AuthorDisplay = ({ author, bannerContent }: { author: Profile, bannerContent: string }) => {
    return <div className="flex flex-row w-full max-w-md justify-start items-start space-x-3 text-foreground text-xs border py-4 px-3 font-mono">
        <div>
            <Image
                className='rounded-full'
                src={author.avatar_url ? author.avatar_url : 'logo_500px.png'}
                alt={"profile picture"}
                width={40} height={40}
                onClick={() => { }}
            />
        </div>
        <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-col ">
                <div>{bannerContent}</div>
                <div className="text-sm font-semibold">{author?.full_name ? author.full_name : "[Deleted User]"}</div>
            </div>
            <Link href={`/profiles/${author.id}`}>
                <div className="flex bg-foreground/5 rounded-lg py-2 px-4 text-sm cursor-pointer">
                    Visit Profile
                </div>
            </Link>
        </div>
    </div>
}

export const ProfileDisplay = ({ author }: { author: Profile }) => {

}