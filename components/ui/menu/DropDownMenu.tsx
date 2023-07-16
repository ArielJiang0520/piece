import { useEffect, useRef } from 'react';
import { IconType } from 'react-icons';

export type DropDownMenuOptions = {
    name: string;
    icon: IconType;
    function: () => void;
};
export interface DropDownMenu {
    setDropdownVisible: (arg: boolean) => void;
    options: DropDownMenuOptions[];
}
export function DropDownMenu({ options, setDropdownVisible }: DropDownMenu) {

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className='z-10 absolute right-[50%] transform translateX([50%]) 
                                        mt-2 w-24 bg-background border rounded-lg shadow-lg
                                        font-mono font-semibold text-foreground/70 text-xs '>
            <div className='flex flex-col py-1'>
                {options.map(option => <div
                    key={option.name}
                    className='flex flex-row justify-start items-center w-full leading-5 hover:bg-foreground/10 px-3 py-2 cursor-pointer'
                    onClick={option.function}
                >
                    <option.icon className='mr-2' /> {option.name}
                </div>)}
            </div>
        </div>
    );
}
