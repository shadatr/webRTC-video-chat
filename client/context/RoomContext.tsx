"use client";
import { useRouter } from "next/navigation";
import Peer from "peerjs";
import { createContext, useEffect, useState, useReducer } from "react";
import socketIOClient from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { PeerReducer } from "../reducers/peerReducer";
import { addPeerAction, removePeerAction } from "../reducers/PeerActions";
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
  const [peers, dispatch] = useReducer(PeerReducer, {});
  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: [],
    isChatOpen: false,
})
  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log(`Entered room ${roomId}`);
    router.replace(`/room/${roomId}`);
  };
  const getUsers = ({ participants }: { participants: string[] }) => {
    console.log("Participants", participants);
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
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
        ws.off("room-created");
        ws.off("get-users");
        ws.off("user-disconnected");
        ws.off("user-joined");
        ws.off("add-message", addMessage);
        ws.off("get-messages", addHistory);
        }
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;
    ws.on("user-joined", ({ peerId }: { peerId: string }) => {
      const call = me.call(peerId, stream);
      call.on("stream", (stream) => {
        dispatch(addPeerAction(peerId, stream));
      });
    });

    me.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (stream) => {
        dispatch(addPeerAction(call.peer, stream));
      });
    });

    return () => {
      ws.off("user-joined");

    };
  }, [me, stream]);

  console.log("chat", { chat });

  return (
    <RoomContext.Provider value={{ ws, me, stream, peers, sendMessage,chat }}>
      {children}
    </RoomContext.Provider>
  );
};
