'use client'
import React, { createContext, useState, useContext, useCallback } from 'react';
import ToastNotification from '@/components/ui/widget/ToastNotification';

interface ToastContextProps {
    showMessage: (content: React.ReactNode) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export default function ToastProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const [toastContent, setToastContent] = useState<React.ReactNode | null>(null);

    const showMessage = useCallback((content: React.ReactNode) => {
        setToastContent(content);
        const timeoutId = setTimeout(() => {
            setToastContent(null);
        }, 5000);

        // Clear timeout if message is manually closed before timeout completes
        return () => clearTimeout(timeoutId);
    }, []);

    const closeToast = useCallback(() => {
        setToastContent(null);
    }, []);

    return (
        <ToastContext.Provider value={{ showMessage }}>
            {children}
            {toastContent && <ToastNotification closeToast={closeToast}>{toastContent}</ToastNotification>}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};