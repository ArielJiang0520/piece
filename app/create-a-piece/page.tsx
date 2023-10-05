import LocalNavBar from './local-navbar';
import CaP from '@/app/create-a-piece/components/CaP';
import { DraftProvider } from './draft-provider';

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams?: { [key: string]: string | undefined };
}) {

    if (searchParams)
        return (
            <DraftProvider>
                <LocalNavBar />
                <div className="w-full md:w-2/3 flex flex-col gap-15 px-5 py-5 lg:py-5 text-foreground font-mono">
                    <CaP />
                </div>
            </DraftProvider>
        )
    else
        return <>No search params found!</>

}   