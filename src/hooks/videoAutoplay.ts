import { useEffect, type RefObject } from "react";

export function videoAutoplay(videoURL: string | undefined, videoRef: RefObject<HTMLVideoElement | null>) {
    useEffect(() => {
        if (!videoURL || !videoRef.current) return;
        
        const video = videoRef.current;

        const attemptPlay = () => {
            video.play().catch((error) => {
                console.error(`Video play failed: ${error}`);
            });
        };

        if(video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
            attemptPlay();
        }
        else {
            video.addEventListener("canplay", attemptPlay, {once: true});
        }

        return () => {
            video.removeEventListener("canplay", attemptPlay);
        }
    }, [videoURL]);
}