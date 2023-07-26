import Image from "next/image";


export function WideScrollingImages({ images, width, height }: { images: any[], width: number, height: number }) {
    return <div className="flex flex-row space-x-1 overflow-x-auto">
        {images
            .map((image, index) =>
                <Image
                    key={index}
                    src="https://via.placeholder.com/500x500"
                    alt="Placeholder Image"
                    width={width}
                    height={height}
                    className="flex-shrink-0"
                />
            )}
    </div>
}