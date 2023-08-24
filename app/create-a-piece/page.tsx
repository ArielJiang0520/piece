import LocalNavBar from './local-navbar';
import CaP from '@/app/create-a-piece/components/CaP';
import { getWorldDetailsById, getPieceById } from '../supabase-server';
import { EmptyPiecePayload } from '@/types/types';
import { DraftProvider } from './draft-provider';

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams?: { [key: string]: string | undefined };
}) {
    if (searchParams) {
        const world_id = searchParams.world_id ?? (await getPieceById(searchParams.edit_id!)).world_id!
        const world = await getWorldDetailsById(world_id)

        if (!world)
            return <></>

        return (
            <DraftProvider>
                <LocalNavBar world={world} />
                <div className="w-full md:w-2/3 flex flex-col gap-15 px-5 py-5 lg:py-5 text-foreground font-mono">
                    <CaP world={world} initValues={EmptyPiecePayload} />
                </div>
            </DraftProvider>
        )
    } else {
        return <></>
    }
}   