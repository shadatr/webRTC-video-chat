import { useEffect, useRef } from "react";

export const VideoPlayer: React.FC<{ stream?: MediaStream }> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            if (stream && stream instanceof MediaStream) {
                videoRef.current.srcObject = stream;
            } else {
                console.warn("Invalid stream provided", stream);
            }
        }
    }, [stream]);

    return <video ref={videoRef} autoPlay playsInline />;
    
};
