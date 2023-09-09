'use client'
import { useState } from 'react'

interface LazyImageClientProps {
    url: string | null;
    dimension: string;
    rounded?: boolean;
    popup?: boolean;
}

export const LazyImage: React.FC<LazyImageClientProps> = ({ url, dimension, rounded = true, popup = false }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupImage, setPopupImage] = useState<string | null>(null);

    const handleImageClick = () => {
        setPopupImage(url);
        setShowPopup(true);
    };

    if (url === null) {
        return (
            <div className={`${dimension} border ${rounded ? "rounded-lg" : ""} flex justify-center items-center`}>
                <div className='w-6 h-6 border-t-4 border-foreground/50 border-opacity-80 rounded-full animate-spin' />
            </div>
        );
    } else {
        return (
            <>
                <img src={url} alt="Placeholder Image" className={`w-auto h-full ${rounded ? "rounded-lg" : ""}`}
                    onClick={handleImageClick} />
                {popup && showPopup && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        onClick={() => setShowPopup(false)}
                    >
                        <div className="bg-background p-1 shadow-lg">
                            <img
                                src={popupImage!}
                                alt="Popup"
                                className="max-w-sm md:max-w-xl 2xl:max-w-2xl h-auto"
                                onClick={e => e.stopPropagation()} // This stops the event from bubbling up
                            />
                        </div>
                    </div>
                )}
            </>
        )
    }
};

export default LazyImage;