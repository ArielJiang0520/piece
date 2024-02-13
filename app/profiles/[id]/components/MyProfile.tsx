
'use client'
import { HistoryIcon } from "@/components/icon/icon"

export default function MyProfile({ id }: { id: string }) {
    return <div>
        <>This is the profile overview for {id}</>
        <div className='flex flex-row w-full justify-end font-mono text-brand text-sm'>
            <button
                type="button"
                className={`cursor-pointer bg-none  flex flex-row items-center justify-center space-x-1 rounded-lg border border-brand py-1 px-2   whitespace-nowrap`}
                onClick={() => { }}
            >
                <HistoryIcon />
                <div>View History</div>
            </button>
        </div>
    </div>
}