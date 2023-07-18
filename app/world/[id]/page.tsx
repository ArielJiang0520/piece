import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getWorldDetailsById } from "@/app/supabase-server";

export default async function WorldDisplay({ params }: { params: { id: string } }) {
    const worldDetails = await getWorldDetailsById(params.id)



    return (<>{worldDetails && JSON.stringify(worldDetails)}</>)

}
