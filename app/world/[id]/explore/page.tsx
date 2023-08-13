
export default async function Page({ params }: { params: { id: string } }) {
    return <div>
        you are at the explore page for {params.id}
    </div>
}
