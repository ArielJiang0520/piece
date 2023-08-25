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

interface CategoriesSwitchTabProps {
    categories: any[],
    items: { [key: string]: any[] }
    selected: any[]
    handleSelect: (item: any) => void;
}
// { items, categoryField, handleSelect }: CategoriesSwitchTabProps
export function CategoriesSwitchTab({ categories, items, selected, handleSelect }: CategoriesSwitchTabProps) {
    const TabPanels = ({ children }: { children: React.ReactNode }) =>
        <Tab.Panel className="w-full h-40 overflow-y-auto p-4 border border-t-0 rounded-b bg-background ">
            {children}
        </Tab.Panel>

    return (
        <div>
            <Tab.Group>
                <Tab.List className="flex pt-2 px-3 space-x-1 bg-foreground/10 rounded-t-md overflow-x-auto font-serif">
                    {categories.map((catgeory) => (
                        <Tab key={catgeory.id}
                            className={({ selected }) => `text-sm whitespace-nowrap py-2 px-3 text-foreground outline-none ${selected ? 'bg-background rounded-t-lg' : ''} `}
                        >
                            {catgeory.name}
                        </Tab>
                    ))}
                </Tab.List>

                <Tab.Panels >
                    {categories.map((category) =>
                        <TabPanels key={category.id}>
                            <div className='flex flex-row flex-wrap'>
                                {items[category.id]
                                    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                                    .map((item, idx) =>
                                        <div
                                            key={idx}
                                            className={`capitalize cursor-pointer  border py-1 px-2 text-xs mr-2 mb-2 rounded-xl ${selected.includes(item.name) ? "bg-brand border-brand text-white" : "bg-foreground/5"}`}
                                            onClick={() => { handleSelect(item) }}
                                        >
                                            {item.name}
                                        </div>
                                    )}
                            </div>
                        </TabPanels>
                    )}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}
