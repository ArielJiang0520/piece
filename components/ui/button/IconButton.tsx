interface IconButtonProps {
    icon: JSX.Element,
    title: string,
}
export function IconButton({ icon, title }: IconButtonProps) {
    return <div className="h-10 flex flex-row items-center justify-center space-x-1 rounded-lg border py-1 px-2">
        <div>
            {icon}
        </div>
        <div className="text-base font-mono text-foreground">
            {title}
        </div>
    </div>
}