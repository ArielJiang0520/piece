import React, { ReactNode } from 'react';
import MarkdownIt from 'markdown-it';
import { getGeneratePrice, getPiecePrice, getStringNumTokens, getWorldNumTokens } from '@/utils/helpers';
import { GenPieceJson, World, Piece } from '@/types/types';

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
    content: string | ReactNode,
    textSize?: string,
    bold?: string,
}

export const FieldContentDisplay: React.FC<FieldContentDisplayProps> = ({ content, textSize = "text-base", bold = "font-normal" }) => {
    return (
        <div>
            <p className={`whitespace-pre-line font-serif ${textSize} ${bold}`}>
                {content}
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

interface MarkdownProps {
    children: string;
    className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children, className }) => {
    const markdown = new MarkdownIt({ breaks: true }) // enabling line breaks

    const createMarkup = () => {
        let html = markdown.render(children);
        html = html.replace(/<p>/g, '<p class="my-2">'); // Add tailwind class here for margin
        html = html.replace(/<a /g, '<a class="text-blue-500 underline "'); // Add tailwind classes heres
        return { __html: html };
    };

    return (
        <div dangerouslySetInnerHTML={createMarkup()} className={`${className}`} />
    );
};


export const GeneratePriceDisplay = ({ world }: { world: World }) => {
    const numTokens: number = getWorldNumTokens(world)
    return <div id="token-group" className='w-full flex flex-col space-y-1 items-center md:flex-row md:justify-center md:space-x-4 py-2 border-t border-b'>

        <div className="flex flex-row justify-end text-sm space-x-1 items-center">
            <span>Total Tokens</span>
            <span className="px-2 py-1 rounded-full bg-foreground/10 text-xs">{numTokens}</span>
        </div>

        <div className="flex flex-row justify-end text-sm space-x-1 items-center">
            <span>GPT4 Price</span>
            <span className="px-2 py-1 rounded-full bg-foreground/10 text-xs">~${getGeneratePrice(numTokens, 4)}/generate</span>
        </div>

        <div className="flex flex-row justify-end text-sm space-x-1 items-center">
            <span>GPT3 Price</span>
            <span className="px-2 py-1 rounded-full bg-foreground/10 text-xs">~${getGeneratePrice(numTokens, 3)}/generate</span>
        </div>
    </div>

}

export const PiecePriceDisplay = ({ world, piece }: { world: World, piece: Piece }) => {
    const model = (piece.piece_json as GenPieceJson).model
    const modelNum = (model && model.includes('3.5')) ? 3 : 4
    const worldTokens: number = getWorldNumTokens(world)
    const pieceTokens: number = getStringNumTokens((piece.piece_json as GenPieceJson).output) + getStringNumTokens((piece.piece_json as GenPieceJson).prompt)

    return <div id="token-group" className='w-full flex flex-col space-y-1 items-center md:flex-row md:justify-center md:space-x-4 py-2 border-t border-b'>

        <div className="flex flex-row justify-end text-sm space-x-1 items-center">
            <span>World Tokens</span>
            <span className="px-2 py-1 rounded-full bg-foreground/10 text-xs">{worldTokens}</span>

            <span>Piece Tokens</span>
            <span className="px-2 py-1 rounded-full bg-foreground/10 text-xs">{pieceTokens}</span>

        </div>

        <div className="flex flex-row justify-end text-sm space-x-1 items-center">
            <span>GPT{model} Price =</span>
            <span className="px-2 py-1 rounded-full bg-foreground/10 text-xs">${getPiecePrice(worldTokens, pieceTokens, modelNum)}</span>
        </div>

    </div>

}
