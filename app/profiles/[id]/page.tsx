import { Suspense } from 'react'


export default async function Page({ params }: { params: { id: string } }) {

    return (
        <Suspense>
            <div className="w-full md:w-2/3 flex flex-col gap-14 px-5 py-5 lg:py-10 text-foreground font-mono">
                <>This is the profile overview for {params.id}</>
            </div>
        </Suspense>
    )
}
