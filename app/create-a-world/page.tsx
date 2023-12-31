// create-a-world
import LocalNavBar from './local-navbar';
import CaW from './components/CaW/CaW'
import { DraftProvider } from './draft-provider';

export default function Page() {
    return (
        <DraftProvider>
            <LocalNavBar />
            <div className="w-full lg:w-4/5 xl:w-2/3 flex flex-col gap-20 px-5 py-5 lg:py-5 text-foreground font-mono">
                <CaW />
            </div>
        </DraftProvider>
    )
}