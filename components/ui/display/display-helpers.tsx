import React from 'react';
import MarkdownIt from 'markdown-it';

interface InputTitleProps {
    label: string,
    textSize?: string
};

export const FieldTitleDisplay: React.FC<InputTitleProps> = ({ label, textSize = "text-base" }) => {
    return (
        <div>
            <label className={`${textSize}  text-foreground/50 font-bold whitespace-nowrap font-mono`}>
                {label.toLocaleUpperCase()}
            </label>
        </div>
    )
}

interface FieldContentDisplayProps {
    content: string,
    textSize?: string,
    bold?: string,
    truncate?: number
}

export const FieldContentDisplay: React.FC<FieldContentDisplayProps> = ({ content, textSize = "text-base", bold = "font-normal", truncate = -1 }) => {
    return (
        <div>
            <p className={`whitespace-pre-line font-serif ${textSize} ${bold}`}>
                {truncate != -1 ?
                    content.length > truncate ?
                        `${content.slice(0, truncate)}...`
                        : content
                    : content}
            </p>
        </div>
    )
}




export const CreatorDisplay = ({ items }: { items: any[] }) => {
    return (
        <div className='w-full border-t border-b grid grid-cols-2 justify-items-start py-5 px-2'>
            {items.map(item =>
                <div className="text-right text-sm">
                    {item}
                </div>)}
        </div>
    )
}


interface MyComponentProps {
    children: string;
    className?: string;
}

export const Markdown: React.FC<MyComponentProps> = ({ children, className }) => {
    const markdown = new MarkdownIt({ breaks: true }) // enabling line breaks

    const createMarkup = () => {
        let html = markdown.render(children);
        html = html.replace(/<p>/g, '<p class="mb-4">'); // Add tailwind class here for margin
        return { __html: html };
    };

    console.log(createMarkup())

    return (
        <div dangerouslySetInnerHTML={createMarkup()} className={`${className} prose prose-sm`} />
    );
};

