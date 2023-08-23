import { CloseIcon } from '@/components/icon/icon';
import LazyImage from '@/components/ui/image/LazyImageClient';
import useHorizontalDragScroll from '@/hooks/useHorizontalScroll';

interface ImagesDisplayRowProps {
    bucket: string;
    dimension: {
        height: string;
        width: string;
    };
    paths: string[];
    del?: {
        hasDelete: boolean;
        onDelete: (arg: any) => void;
    };
    popup?: boolean
}
export function ImagesDisplayRow({ bucket, dimension, paths, del = { hasDelete: false, onDelete: () => { } }, popup = false }: ImagesDisplayRowProps) {
    const { startDrag, stopDrag, doDrag } = useHorizontalDragScroll();

    return <div id='image-display' className="flex flex-row space-x-2 horizontal-scroll hide-scrollbar"
        onMouseDown={startDrag}
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
        onMouseMove={doDrag}
    >
        {paths.map((path, index) => <div key={index} className={`relative ${dimension.height} flex-shrink-0`}>
            <LazyImage bucket={bucket} path={path} dimension={`${dimension.height} ${dimension.width}`} popup={popup} />

            {del.hasDelete ? <button
                id="delete-button"
                onClick={() => del.onDelete(index)}
                type="button"
                className="absolute top-5 right-5 bg-foreground text-background rounded-full w-5 h-5 flex items-center justify-center opacity-70 p-1"
                style={{ transform: 'translate(50%,-50%)' }}
            >
                <CloseIcon />
            </button> : null}

        </div>
        )}
    </div>;
}
