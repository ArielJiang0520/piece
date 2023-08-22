'use client'
import React, { useState } from 'react';
import { Field } from 'formik';

type TextInputProps = {
    name: string,
    placeholder: string,
    textSize: string,
    multiline: number,
    bold?: string,
};

export const TextInput: React.FC<TextInputProps> = ({ name, placeholder, textSize, multiline, bold = "font-normal" }) => {
    return (
        <div className={`${textSize} ${bold}`}>
            {multiline === 1 ?
                <Field
                    name={name}
                    type="text"
                    className="w-full singleLineInput"
                    placeholder={placeholder}
                /> :
                <Field
                    as="textarea"
                    name={name}
                    rows={multiline}
                    className="multiLineInput"
                    placeholder={placeholder}
                />}
        </div>
    );
};


type TextInputWithEnterProps = {
    placeholder: string,
    textSize: string,
    onEnter: (value: string) => void;
};

export const TextInputWithEnter: React.FC<TextInputWithEnterProps> = ({ placeholder, textSize, onEnter }) => {
    const [curInput, setCurInput] = useState('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurInput(event.target.value);
    }
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            onEnter(curInput);
            setCurInput('')
        }
    }
    return (
        <div className={`${textSize}`}>
            <input
                type="text"
                className="w-full singleLineInput"
                placeholder={placeholder}
                value={curInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}