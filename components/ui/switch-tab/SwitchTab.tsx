'use client'
import { Tab } from '@headlessui/react'

const tabSwitchColor = ({ selected }: any) => (
    `w-full py-2.5 text-sm leading-5 text-background font-bold rounded-lg outline-none ${selected ? 'bg-background text-foreground shadow' : ''}`
)

interface SwitchTabProps {
    titles: string[]
    contents: React.ReactNode[]
    onTabChange: (index: number) => void;
}

export default function SwitchTab({ titles, contents, onTabChange }: SwitchTabProps) {
    return (
        <>
            <Tab.Group onChange={onTabChange}>
                <Tab.List className="mt-4 flex flex-row p-1 space-x-1 bg-foreground/50 rounded-md justify-center items-center">
                    {titles.map((title, index) =>
                        <Tab key={index} className={tabSwitchColor}>{title.toUpperCase()}</Tab>
                    )}
                </Tab.List>
                <Tab.Panels className="mt-2">
                    {contents.map((content, index) => <Tab.Panel key={index}>{content}</Tab.Panel>)}
                </Tab.Panels>
            </Tab.Group>
        </>
    )
}   