'use client'
import { World } from "@/types/types"
import { useState } from "react"
import { EyeIcon } from "@/components/icon/icon"
import { FieldTitleDisplay } from "../display-helpers"
import PopupDialog from "@/components/ui/input/PopupDialog"
import WorldDisplay from "./WorldDisplay"

interface PeekWorldProps {
    world: World,
    iconOnly?: boolean;
}
export default function PeekWorld({ world, iconOnly = false }: PeekWorldProps) {
    const [isReviewWorldOpen, setIsReviewWorldOpen] = useState(false)
    return <>
        {iconOnly ?
            <EyeIcon className='h-5 w-5 cursor-pointer text-foreground/50 ' onClick={() => setIsReviewWorldOpen(true)} />
            : <div id="view-group" className='flex flex-row justify-end items-center text-foreground/50 '>
                <button type="button" className='flex flex-row items-center py-1 px-2 border rounded-lg space-x-1' onClick={() => setIsReviewWorldOpen(true)}>
                    <EyeIcon className='h-3 w-3' />
                    <FieldTitleDisplay label={"Peek the world"} textSize='text-xs' />
                </button>
            </div>}
        <PopupDialog
            isOpen={isReviewWorldOpen}
            setIsOpen={setIsReviewWorldOpen}
            dialogTitle=''
            dialogContent=''
            initInputValue={<WorldDisplay world={world} preview={true} />}
            confirmAction={() => setIsReviewWorldOpen(false)}
            dialogType='display'
            overwriteConfirm='Close'
            hideCancel={true}
        />
    </>
}