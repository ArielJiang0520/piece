
export const metadata = {
    title: 'Viewing a World | Piece',
    description: 'Generated by create next app',
}

export default function CreateLayout({
    children,
    params,
}: {
    children: React.ReactNode,
    params: { id: string }
}) {
    return (
        <>

            {children}
        </>
    )
}
