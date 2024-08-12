import { useEffect, useRef } from "react";

export const VideoPlayer = ({ stream, className }:{stream?:MediaStream, className?:string}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) videoRef.current.srcObject = stream;
    }, [stream]);
    return (
        <video
            data-testid="peer-video"
            className={className}
            ref={videoRef}
            autoPlay
            muted={false}
        />
    );
};
