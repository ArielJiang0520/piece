'use client'
import { EyeIcon, FireIcon, PlusIcon } from "@/components/icon/icon";
import { IconButtonMid } from "@/components/ui/button/button-helpers";
import { Modifier } from "@/types/types";
import Masonry from 'masonry-layout';
import { useRef, useEffect, useState } from 'react';
import Image from "next/image";
import { ModifierDetails } from "@/app/supabase-server";
import PopupDialog from "@/components/ui/input/PopupDialog";
import { insert_modifier } from "@/utils/modifier-helpers";
import { useSupabase } from '@/app/supabase-provider';
import { User } from "@supabase/supabase-js";
import { notify_success, notify_error } from "@/components/ui/widget/toast";
import { Markdown } from "@/components/ui/display/display-helpers";

function AddModifier({ user }: { user: User }) {

    const [isAddNewOpen, setIsAddNewOpen] = useState(false);
    const onAddNew = () => {
        setIsAddNewOpen(true);
    }

    return (
        <>
            <div className="flex flex-row w-full justify-end" onClick={() => onAddNew()}>
                <IconButtonMid icon={<PlusIcon />} title={"Add New"} />
            </div>
            <PopupDialog
                isOpen={isAddNewOpen}
                setIsOpen={() => setIsAddNewOpen(false)}
                dialogTitle={"Add New Modifier"}
                dialogContent={""}
                dialogType="add-modifier"
                initInputValue={
                    {
                        name: '',
                        content: '',
                        description: '',
                    } as Modifier
                }
                confirmAction={async (values: Modifier) => {
                    try {
                        await insert_modifier(values, user.id)
                        notify_success(<div>
                            Modifier successfully added!
                        </div>, 10000)
                    } catch (error) {
                        notify_error(`Error posting new modifier: ${JSON.stringify(error)}`)
                    }
                    setIsAddNewOpen(false);
                }}

            />
        </>
    )
}


export default function Modifiers({ modifiers }: { modifiers: ModifierDetails[] }) {
    const { user } = useSupabase();

    const masonryGridRef = useRef<HTMLDivElement | null>(null);
    const masonryInstanceRef = useRef<Masonry | null>(null);

    useEffect(() => {
        if (masonryGridRef.current && !masonryInstanceRef.current) {
            masonryInstanceRef.current = new Masonry(masonryGridRef.current, {
                itemSelector: '.masonry-item',
                percentPosition: true
            });
        }

        const timeout = setTimeout(() => {
            if (masonryInstanceRef.current) {
                masonryInstanceRef.current.layout!();
            }
        }, 1000);  // 100 ms delay. Adjust as needed.

        return () => {
            clearTimeout(timeout);
            if (masonryInstanceRef.current) {
                masonryInstanceRef.current.destroy!();
                masonryInstanceRef.current = null;
            }
        };
    }, [modifiers]);

    return (
        <>
            {user && <AddModifier user={user} />}
            <div ref={masonryGridRef} className="masonry-grid">
                {modifiers.map((modifier) => (
                    <div key={modifier.id} className="masonry-item w-full lg:w-1/2 xl:w-1/3 2xl:w-1/4 p-2">
                        <div>
                            <div id="card" className="p-4 bg-foreground/5 rounded-lg flex flex-col space-y-2">
                                <div id="profile" className="flex flex-row items-center justify-between font-mono text-sm space-x-1 text-foreground/80  my-1">
                                    <div id="avatar" className="flex flex-row justify-start items-center space-x-1 text-foreground  ">
                                        <Image
                                            className='block rounded-full'
                                            src={modifier.profiles?.avatar_url ? modifier.profiles?.avatar_url : '/logo_500px.png'}
                                            alt={"profile picture"}
                                            width={20} height={20}
                                            onClick={() => { }}
                                        />
                                        <div className="w-auto  whitespace-nowrap">{modifier.profiles?.full_name ? modifier.profiles?.full_name : "[Deleted User]"}</div>
                                    </div>

                                    <div className="flex flex-row justify-end  ">
                                        <FireIcon />
                                        <div className="text-xs ml-1">{modifier.usage}</div>
                                    </div>

                                </div>

                                <div className="font-bold text-md">{modifier.name}</div>
                                <div className="text-sm italic">{modifier.description !== "" ? modifier.description : "No description."}</div>

                                <div className="hpx w-full border border-t"></div>

                                <div className="text-xs">
                                    <Markdown className="text-xs font-serif">
                                        {modifier.content!}
                                    </Markdown>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}