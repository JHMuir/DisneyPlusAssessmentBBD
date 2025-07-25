import { useEffect, type RefObject } from "react";

export function videoAutoplay(videoURL: string | undefined, videoRef: RefObject<HTMLVideoElement | null>) {
    useEffect(() => {
        if (videoURL && videoRef.current) {
            const video = videoRef.current;
            setTimeout(() => {
                video.play().catch((error) => {
                    console.log(`Error: ${error}`);
                });
            }, 100);
        }
    }, [videoURL]);
}