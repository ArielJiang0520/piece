'use client'
import { Tab } from '@headlessui/react'
import AIPrompt from '@/components/AIPrompt';
import { FieldTitleDisplay } from '@/components/ui/display/displays';
import { FieldContentDisplay } from '@/components/ui/display/displays';
import { useSearchParams } from 'next/navigation'

const tabSwitchColor = ({ selected }: any) => (
    `w-full py-2.5 text-sm leading-5 text-background font-bold rounded-lg outline-none ${selected ? 'bg-background text-foreground shadow' : ''}`
)

export default function Page() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    if (!id)
        return <>Error! No id found</>

    console.log(`On create-a-piece page with worldId=${id}`)
    return (
        <div className="w-full md:w-2/3 flex flex-col gap-14 px-5 py-16 lg:py-24 text-foreground font-mono">
            <div>
                <FieldTitleDisplay label="creating piece for..." />
                <FieldContentDisplay content="HP (high school AU)" textSize="text-4xl" bold="font-bold" />
            </div>
            <div>
                <FieldTitleDisplay label="SELECT YOUR INPUT TYPE:" />
                <Tab.Group>
                    <Tab.List className="my-4 flex flex-row w-full p-1 space-x-1 bg-foreground/50 rounded-md justify-center items-center">
                        <Tab className={tabSwitchColor}>TEXT</Tab>
                        <Tab className={tabSwitchColor}>MEDIA</Tab>
                        <Tab className={tabSwitchColor}>AI PROMPT</Tab>
                    </Tab.List>
                    <Tab.Panels className="py-4">
                        <Tab.Panel>Content 1</Tab.Panel>
                        <Tab.Panel>Content 2</Tab.Panel>
                        <Tab.Panel>
                            <AIPrompt worldId={id} />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    )
}   