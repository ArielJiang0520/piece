export const LoadingOverlay: React.FC = () => (
    <div className="fixed inset-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="relative w-12 h-12 border-t-4 border-white border-opacity-80 rounded-full animate-spin"></div>
    </div>
);