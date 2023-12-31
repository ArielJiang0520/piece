import WorldCard from "@/components/ui/display/World/WorldCard"
import { WorldMetadata } from "@/app/supabase-server"

export default function AllWorlds({ worlds }: { worlds: WorldMetadata[] }) {
    return <div className="flex flex-col">
        <div className="flex flex-row w-full justify-start items-center p-2">
            <div className="font-mono text-xs font-medium">
                {`${worlds.length} worlds found.`}
            </div>
        </div>
        <div className="flex flex-col space-y-2 mt-2">
            {worlds.map((world, idx) =>
                <WorldCard
                    key={idx}
                    world={world}
                    isOwner={false}
                />
            )}
        </div>
    </div>
}