import React from 'react';
import { Field } from 'formik';

type TextInputProps = {
    name: string,
    placeholder: string,
    textSize: string,
    multiline: number,
};

const TextInput: React.FC<TextInputProps> = ({ name, placeholder, textSize, multiline }) => {

    return (
        <div className={`${textSize}`}>

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

export default TextInput;
