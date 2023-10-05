'use client'
import React, { useEffect, useState } from 'react';
import { Field } from 'formik';

type TextInputProps = {
    name: string,
    placeholder: string,
    textSize: string,
    multiline: number,
    bold?: string,
};

export const TextInput: React.FC<TextInputProps> = ({ name, placeholder, textSize, multiline, bold = "font-normal" }) => {
    const [isFocused, setFocused] = useState(false);
    return (
        <div className={`${textSize} ${bold}`}>
            {multiline === 1 ?
                <Field
                    name={name}
                    type="text"
                    className="w-full singleLineInput"
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                /> :
                <Field
                    as="textarea"
                    name={name}
                    rows={multiline}
                    className="multiLineInput"
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />}
            {isFocused ? <div className='border-t border-brand h-px border-1' /> : <div className='border-t border-brand opacity-0 h-px border-1' />}
        </div>
    );
};

interface TextInputFreeformProps {
    initValue: string;
    onChange: (arg: string) => void;
    placeholder: string,
    textSize: string,
    multiline: number,
    bold?: string,
}
export const TextInputFreeform: React.FC<TextInputFreeformProps> = ({ initValue, onChange, placeholder, textSize, multiline, bold = "font-normal" }) => {
    const [isFocused, setFocused] = useState(false);
    const [curValue, setCurValue] = useState(initValue)

    useEffect(() => {
        setCurValue(initValue)
    }, [initValue])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurValue(event.target.value);

    }

    return (
        <div className={`${textSize} ${bold}`}>
            {multiline === 1 ?
                <input
                    value={curValue}
                    onChange={handleChange}
                    className="w-full singleLineInput"
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => { setFocused(false); onChange(curValue) }}
                /> :
                <textarea
                    value={curValue}
                    onChange={handleChange}
                    rows={multiline}
                    className="multiLineInput"
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => { setFocused(false); onChange(curValue) }}
                />}
            {isFocused ? <div className='border-t border-brand h-px border-1' /> : <div className='border-t border-brand opacity-0 h-px border-1' />}
        </div>
    );
}


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