"use client";
import {
    createContext,
    useEffect,
    useState,
    useReducer,
    useContext,
} from "react";
import socketIOClient from "socket.io-client";
import { peersReducer, PeerState } from "../reducers/peerReducer";
import {
    addPeerStreamAction,
    addPeerNameAction,
    removePeerStreamAction,
    addAllPeersAction,
} from "../reducers/peerActions";
import { UserContext } from "./UserContext";
import { IPeer } from "@/types/peer";
import Peer from "peerjs";
import { useRouter } from "next/navigation";

const WS = "http://localhost:8080";
const ws = socketIOClient(WS);

interface RoomValue {
    ws: any;
    stream?: MediaStream;
    screenStream?: MediaStream;
    peers: PeerState;
    // shareScreen: () => void;
    roomId: string;
    setRoomId: (id: string) => void;
    screenSharingId: string;
}

export const RoomContext = createContext<RoomValue>({
    ws: ws,
    peers: {},
    // shareScreen: () => {},
    setRoomId: (id) => {},
    screenSharingId: "",
    roomId: "",
});


export const RoomProvider=({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const router = useRouter();
    const { userName, userId } = useContext(UserContext);
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [screenStream, setScreenStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(peersReducer, {});
    const [screenSharingId, setScreenSharingId] = useState<string>("");
    const [roomId, setRoomId] = useState<string>("");

    const enterRoom = ({ roomId }: { roomId: "string" }) => {
        router.replace(`/room/${roomId}`);
    };

    const removePeer = (peerId: string) => {
        dispatch(removePeerStreamAction(peerId));
    };

    // const switchStream = (stream: MediaStream) => {
    //     setScreenSharingId(me?.id || "");
    //     Object.values(me?.).forEach((connection: any) => {
    //         const videoTrack: any = stream
    //             ?.getTracks()
    //             .find((track) => track.kind === "video");
    //         connection[0].peerConnection
    //             .getSenders()
    //             .find((sender: any) => sender.track.kind === "video")
    //             .replaceTrack(videoTrack)
    //             .catch((err: any) => console.error(err));
    //     });
    // };

    // const shareScreen = () => {
    //     if (screenSharingId) {
    //         navigator.mediaDevices
    //             .getUserMedia({ video: true, audio: true })
    //             .then(switchStream);
    //     } else {
    //         navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
    //             switchStream(stream);
    //             setScreenStream(stream);
    //         });
    //     }
    // };

    const nameChangedHandler = ({
        peerId,
        userName,
    }: {
        peerId: string;
        userName: string;
    }) => {
        dispatch(addPeerNameAction(peerId, userName));
    };

    useEffect(() => {
        ws.emit("change-name", { peerId: userId, userName, roomId });
    }, [userName, userId, roomId]);

    useEffect(() => {
        const peer = new Peer(userId);
        setMe(peer);
        
        try {
            navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setStream(stream);
            });
        } catch (error) {
            console.error(error);
        }

        ws.on("room-created", enterRoom);
        ws.on("get-users", ({ participants }: { participants: Record<string, IPeer> }) => {dispatch(addAllPeersAction(participants)); console.log("get users", participants);});
        ws.on("user-disconnected", removePeer);
        ws.on("user-started-sharing", (peerId) => setScreenSharingId(peerId));
        ws.on("user-stopped-sharing", () => setScreenSharingId(""));
        ws.on("name-changed", nameChangedHandler);

        return () => {
            ws.off("room-created");
            ws.off("get-users");
            ws.off("user-disconnected");
            ws.off("user-started-sharing");
            ws.off("user-stopped-sharing");
            ws.off("name-changed");
            me?.disconnect();
        };
     }, []);

    useEffect(() => {
        if (screenSharingId) {
            ws.emit("start-sharing", { peerId: screenSharingId, roomId });
        } else {
            ws.emit("stop-sharing");
        }
    }, [screenSharingId, roomId]);

    useEffect(() => {
        if (!me) return;
        if (!stream) return;
        ws.on("user-joined", ({ peerId, userName: name }) => {
            const call = me.call(peerId,stream,{
                metadata: {
                    userName,
                },
            })
            console.log("user joined", call);
            call.on("stream", (peerStream) => {
                dispatch(addPeerStreamAction(peerId, peerStream));
            });
            
            dispatch(addPeerNameAction(peerId, name));
            call.on("error", (error) => {
                console.error("Call error:", error);
            });
        
        });
        
        me.on("call", (call) => {
            const { userName } = call.metadata;
            dispatch(addPeerNameAction(call.peer, userName));
            call.answer(stream);
            call.on("stream", (peerStream) => {
                console.log("user joined", userName);
                dispatch(addPeerStreamAction(call.peer, peerStream));
            });
            call.on("error", (error) => {
                console.error("Call error:", error);
            });
    
        });

        return () => {
            ws.off("user-joined");
        };
    }, [me, stream, userName]);

    console.log("peers", peers);

    return (
        <RoomContext.Provider
            value={{
                ws,
                stream,
                screenStream,
                peers,
                // shareScreen,
                roomId,
                setRoomId,
                screenSharingId,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};
