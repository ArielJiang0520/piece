import React, { createContext, useState } from 'react';
import { WorldPayload, cast_to_worldpayload } from '@/types/types.world';
import { useContext } from 'react';
interface DraftContextData {
    currentDraft: WorldPayload | null;
    handleDraftChange: (selectedOption: any) => void;
}
export const DraftContext = createContext<DraftContextData | undefined>(undefined);

export function DraftProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const [currentDraft, setCurrentDraft] = useState<WorldPayload | null>(null);

    const handleDraftChange = (selectedOption: any) => {
        if (selectedOption.id === 'default') {
            setCurrentDraft(null)
        } else {
            setCurrentDraft(cast_to_worldpayload(selectedOption))
        }
    }

    return (
        <DraftContext.Provider value={{ currentDraft, handleDraftChange }}>
            {children}
        </DraftContext.Provider>
    );
};

export function useDraftContext() {
    const context = useContext(DraftContext);
    if (context === undefined) {
        throw new Error('useDraftContext must be used within a DraftProvider');
    }
    return context;
}