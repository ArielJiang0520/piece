// import { useState } from "react"
// import PopupDialog from "@/components/ui/input/PopupDialog"
// import { PiecePayload, World, =, cast_to_profile } from "@/types/types"
// import { EyeIcon } from "@/components/icon/icon"
// import PieceDisplay from "@/components/ui/display/Piece/PieceDisplay"
// import { User } from "@supabase/supabase-js"

// interface PreviewButtonProps {
//     values: PiecePayload,
//     world: World
//     user: User
// }
// export default function PreviewButton({ values, world, user }: PreviewButtonProps) {
//     const [isReviewOpen, setIsReviewOpen] = useState(false)
//     return <>
//         <button className="flex items-center justify-center w-full h-full p-2 primaryButton" onClick={() => setIsReviewOpen(true)} type="button">
//             <EyeIcon className="w-6 h-6" />
//         </button>
//         <PopupDialog
//             isOpen={isReviewOpen}
//             setIsOpen={setIsReviewOpen}
//             dialogTitle='Preview of your piece'
//             dialogContent=''
//             initInputValue={<PieceDisplay isOwner={false} piece={cast_to_piece(values)} world={world} author={cast_to_profile(user)} preview={true} folder={ } />}
//             confirmAction={() => { }}
//             dialogType='display'
//             hideCancel={true}
//             overwriteConfirm='Close'
//         />
//     </>
// }