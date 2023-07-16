import React from 'react';

type InputTitleProps = {
    label: string,
};

export const InputTitle: React.FC<InputTitleProps> = ({ label }) => {
    return (
        <div>
            <label className="text-base mb-2 text-foreground/50 font-bold">
                {label.toLocaleUpperCase()}
            </label>
        </div>
    )
}