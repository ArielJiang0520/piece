import LocalNavBar from './local-navbar';
import CaP from '@/app/create-a-piece/components/CaP';
import { getWorldDetailsById } from '../supabase-server';
import { EmptyPiecePayload } from '@/types/types.world';
import { v4 as uuidv4 } from 'uuid';
import PeekWorld from '@/components/ui/display/World/PeekWorld';

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    if (searchParams) {
        const world = await getWorldDetailsById(searchParams.id as string)
        const piece_id = uuidv4();

        if (!world)
            return <></>

        return (
            <>
                <LocalNavBar worldName={world?.world_name} />
                <div className="w-full md:w-2/3 flex flex-col gap-15 px-5 py-5 lg:py-5 text-foreground font-mono">
                    <PeekWorld world={world} />
                    <CaP piece_id={piece_id} world={world} initValues={EmptyPiecePayload} />
                </div>
            </>
        )
    } else {
        return <></>
    }
}   