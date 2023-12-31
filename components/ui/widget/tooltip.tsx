import Tippy from '@tippyjs/react';
import { HelpIcon } from '@/components/icon/icon';
import { ReactNode } from 'react';

interface HelpTooltipProps {
    tooltipText: string;
}
export const HelpTooltip: React.FC<HelpTooltipProps> = ({ tooltipText }) => {
    return (
        <Tippy content={tooltipText} arrow={true} delay={100} animation="scale" maxWidth={350} placement="top" interactive={true}
            className=' text-background text-xs font-mono rounded  '>
            <button type="button"><HelpIcon className="w-5 h-5 text-foreground/50 " /></button>
        </Tippy>
    );
};


interface TooltipWrapProps {
    tooltipText: string;
    children: ReactNode;
}

export const TooltipWrap = ({ tooltipText, children }: TooltipWrapProps) => {
    return (
        <Tippy content={tooltipText} arrow={true} delay={100} animation="scale" maxWidth={350} placement="top" interactive={true}
            className='text-background text-xs font-mono rounded  ' >
            <div className='cursor-pointer '>
                {children}
            </div>
        </Tippy>
    );
};