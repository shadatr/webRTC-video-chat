"use client";
import { useRouter } from "next/navigation";
import Peer from "peerjs";
import { createContext, useEffect, useState, useReducer } from "react";
import socketIOClient from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { peersReducer } from "../reducers/peerReducer";
import { IPeer, addAllPeersAction, addPeerStreamAction, removePeerStreamAction } from "../reducers/PeerActions";
import { IMessage } from "@/types/chat";
import { chatReducer } from "@/reducers/chatReducer";
import { addHistoryAction, addMessageAction } from "@/reducers/chatActions";

const WS = "http://localhost:8080";
export const RoomContext = createContext<null | any>(null);
const ws = socketIOClient(WS);

export const RoomProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: [],
    isChatOpen: false,
  });

  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log(`Entered room ${roomId}`);
    router.replace(`/room/${roomId}`);
  };

  const getUsers = ({
    participants,
  }: {
    participants: Record<string, IPeer>;
  }) => {
    dispatch(addAllPeersAction(participants));
            console.log("get users", participants);

  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerStreamAction(peerId));
  };

  const sendMessage = (message: string, roomId: string, author: string) => {
    const messageData: IMessage = {
      content: message,
      timestamp: new Date().getTime(),
      author,
    };
    chatDispatch(addMessageAction(messageData));
    ws.emit("send-message", roomId, messageData);
  };

  const addMessage = (message: IMessage) => {
    chatDispatch(addMessageAction(message));
  };

  const addHistory = (messages: IMessage[]) => {
    chatDispatch(addHistoryAction(messages));
  };

  useEffect(() => {
    const meId = uuidv4();
    const peer = new Peer(meId);
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
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
    ws.on("add-message", addMessage);
    ws.on("get-messages", addHistory);

    return () => {
      ws.off("room-created", enterRoom);
      ws.off("get-users", getUsers);
      ws.off("user-disconnected", removePeer);
      ws.off("add-message", addMessage);
      ws.off("get-messages", addHistory);
    };
  }, []);

  useEffect(() => {
    if (!me || !stream) return;
  
    ws.on("user-joined", ({ peerId, roomId, stream: newUserStream }: { peerId: string; roomId: string; stream: MediaStream }) => {
      if (newUserStream instanceof MediaStream) {
        dispatch(addPeerStreamAction(peerId, newUserStream));
      } else {
        console.error("Stream is not an instance of MediaStream.");
      }
    });
  
    me.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (remoteStream) => {
        if (remoteStream instanceof MediaStream) {
          dispatch(addPeerStreamAction(call.peer, remoteStream));
        } else {
          console.error("Remote stream is not an instance of MediaStream.");
        }
      });
    });
  
    return () => {
      ws.off("user-joined");
    };
  }, [me, stream]);
  
  

  return (
    <RoomContext.Provider value={{ ws, me, stream, peers, sendMessage, chat }}>
      {children}
    </RoomContext.Provider>
  );
};
