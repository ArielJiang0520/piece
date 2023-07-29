'use client'
import { PieceProvider, usePieceContext } from './piece-provider';
import LocalNavBar from './local-navbar';
import CaPText from '@/app/create-a-piece/CaPText';

function Content() {
    const { inputType } = usePieceContext();
    return (
        <div className="w-full md:w-2/3 flex flex-col gap-20 px-5 py-5 lg:py-5 text-foreground font-mono">
            {inputType === "text" ? <CaPText /> : null /* some other component here */}
        </div>
    );
}

export default function Page() {
    return (
        <PieceProvider>
            <LocalNavBar />
            <Content />
        </PieceProvider>
    )
}   