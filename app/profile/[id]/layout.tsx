import LocalNavBar from "./local-navbar";


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
            <LocalNavBar profile_id={params.id} />
            {children}
        </>
    )
}
