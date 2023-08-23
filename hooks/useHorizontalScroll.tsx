import { useState } from 'react';

const useHorizontalDragScroll = () => {
    const [isDragging, setDragging] = useState<boolean>(false);
    const [startX, setStartX] = useState<number>(0);
    const [scrollLeft, setScrollLeft] = useState<number>(0);

    const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        setDragging(true);
        setStartX(e.pageX - e.currentTarget.offsetLeft);
        setScrollLeft(e.currentTarget.scrollLeft);
    };

    const stopDrag = () => {
        setDragging(false);
    };

    const doDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - e.currentTarget.offsetLeft;
        const walk = x - startX;
        e.currentTarget.scrollLeft = scrollLeft - walk;
    };

    return {
        isDragging,
        startDrag,
        stopDrag,
        doDrag
    };
};

export default useHorizontalDragScroll;
