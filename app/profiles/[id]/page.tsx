import { Suspense } from 'react'
import MyProfile from './components/MyProfile'

export default async function Page({ params }: { params: { id: string } }) {

    return (
        <Suspense>
            <div className="w-full md:w-2/3 flex flex-col gap-14 px-5 py-5 lg:py-10 text-foreground font-mono">
                <MyProfile id={params.id} />
            </div>
        </Suspense>
    )
}
