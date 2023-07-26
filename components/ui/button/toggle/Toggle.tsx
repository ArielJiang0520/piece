import { Switch } from '@headlessui/react';

type ToggleProps = {
    handleToggle: (value: boolean) => void;
    isEnabled: boolean;
};

export const ToggleButton = ({ handleToggle, isEnabled }: ToggleProps) => {
    return (
        <Switch
            checked={isEnabled}
            onChange={handleToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground
            ${isEnabled ? 'bg-foreground' : 'bg-foreground/20'}`}
        >
            {/* <span className="sr-only">Enable notifications</span> */}
            <span id="dot"
                className={`${isEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-background rounded-full transition-transform`}
            />
        </Switch>
    );
};
