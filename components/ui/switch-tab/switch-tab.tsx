'use client'
import { Tab } from '@headlessui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { StarsIcon } from '@/components/icon/icon'

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
        <Tab.Group onChange={onTabChange}>
            <Tab.List className="w-full flex flex-row p-1 space-x-1 bg-foreground/50 rounded-md justify-between items-center whitespace-nowrap overflow-hidden">
                {titles.map((title, index) =>
                    <Tab key={index} className={tabSwitchColor}>{title.toUpperCase()}</Tab>
                )}
            </Tab.List>
            <Tab.Panels className="w-full  mt-2">
                {contents.map((content, index) => <Tab.Panel key={index}>{content}</Tab.Panel>)}
            </Tab.Panels>
        </Tab.Group>
    )
}


interface NavBarSwitchTab {
    tabs: any[],
    onChange: (arg: any) => void;
}
export function NavBarSwitchTab({ tabs, onChange }: NavBarSwitchTab) {
    return (
        <Tab.Group
            onChange={(index) => { onChange(index) }}>
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

interface NavBarSwitchLinkProps {
    tabs: {
        name: any;
        link: string;
    }[];
    pinned?: boolean
}
export function NavBarSwitchLink({ tabs, pinned = false }: NavBarSwitchLinkProps) {
    const mainTabs = pinned ? tabs.slice(0, tabs.length - 1) : tabs
    const pinnedTab = tabs[tabs.length - 1]
    return (
        <Tab.Group selectedIndex={tabs.findIndex(tab => tab.link === usePathname())}>
            <div className="flex h-full overflow-hidden"> {/* <-- Parent container */}

                {/* Scrollable Tab List */}
                <div className="flex-grow overflow-x-auto whitespace-nowrap px-4">
                    <Tab.List className='h-full flex flex-row justify-start mb-0 pb-0'>
                        {mainTabs.map((tab, idx) => (
                            <Tab key={idx} className="outline-none mb-0 pb-0">
                                <Link href={tab.link}>
                                    <div className={`capitalize h-full font-mono text-sm text-foreground/80 flex px-5 items-center border-b-2 ui-selected:border-brand ui-selected:font-bold ui-not-selected:border-transparent`} >
                                        {tab.name}
                                    </div>
                                </Link>
                            </Tab>
                        ))}
                    </Tab.List>
                </div>

                {/* Pinned Tab */}
                {pinned && <div className="flex-none whitespace-nowrap px-4">
                    <Tab.List className='h-full flex flex-row justify-end mb-0 pb-0'>
                        <Tab key={tabs.length - 1} className="outline-none mb-0 pb-0">
                            <Link href={pinnedTab.link}>
                                <div className={`capitalize h-full font-mono text-sm text-background flex items-center border-b-2 ui-selected:border-brand ui-selected:font-bold ui-not-selected:border-transparent`} >
                                    <div className='flex flex-row items-center py-1 px-2 rounded-xl bg-brand'>
                                        <StarsIcon className='mr-1' />
                                        {pinnedTab.name}
                                    </div>
                                </div>
                            </Link>
                        </Tab>
                    </Tab.List>
                </div>}

            </div>
        </Tab.Group>
    )
}