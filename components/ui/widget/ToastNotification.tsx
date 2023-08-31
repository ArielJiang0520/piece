// ToastNotification.tsx
import React from 'react';

interface ToastNotificationProps {
    children: React.ReactNode;
    closeToast: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ children, closeToast }) => {
    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg max-w-sm border border-gray-200">
            <div className="flex justify-between items-center">
                {children}
                <button onClick={closeToast} className="text-red-500 ml-4">
                    ✕
                </button>
            </div>
        </div>
    );
}

export default ToastNotification;