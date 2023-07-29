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

export function SolidSwitchTab({ titles, contents, onTabChange }: SwitchTabProps) {
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

interface NavBarSwitchTab {
    tabs: any[],
    onChange: (arg: any) => void;
}
export function NavBarSwitchTab({ tabs, onChange }: NavBarSwitchTab) {
    return (
        <Tab.Group
            onChange={(index) => { onChange(tabs[index]) }}>
            <Tab.List className='h-full flex flex-row justify-start px-4 overflow-x-auto whitespace-nowrap mb-0 pb-0'>
                {tabs.map((tab, idx) => (
                    <Tab key={idx} className="outline-none mb-0 pb-0">
                        <div className={`capitalize  h-full font-mono text-sm text-foreground/80 flex px-5 items-center border-b-2 ui-selected:border-brand ui-selected:font-bold ui-not-selected:border-transparent`} >
                            {tab}
                        </div>
                    </Tab>
                ))}
            </Tab.List>
        </Tab.Group>
    )
}