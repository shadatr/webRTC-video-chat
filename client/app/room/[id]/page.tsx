"use client";

import { NameInput } from "@/common/Name";
import { ChatButton } from "@/components/ChatButton";
import { ShareScreenButton } from "@/components/ShareScreeenButton";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Chat } from "@/components/chat/Chat";
import { ChatContext } from "@/context/ChatContext";
import { RoomContext } from "@/context/RoomContext";
import { UserContext } from "@/context/UserContext";
import { PeerState } from "@/reducers/peerReducer";
import React, { use, useContext, useEffect } from "react";

const Page = ({ params }: { params: { id: string } }) => {
  
  const { ws } = useContext(RoomContext);
  const { stream, screenStream, peers,
    //  shareScreen,
      screenSharingId, setRoomId } =
  useContext(RoomContext);
const { userName, userId } = useContext(UserContext);
const { toggleChat, chat } = useContext(ChatContext);

useEffect(() => {
  if (!userName) {
      console.warn("userName is not set");
      return;
  }
  if (stream) {
      ws.emit("join-room", { roomId: params.id, peerId: userId, userName ,stream: stream.id});
  }
}, [params.id, userId, stream, userName, ws]);


useEffect(() => {
  setRoomId(params.id || "");
}, [params.id, setRoomId]);

const screenSharingVideo =
  screenSharingId === userId
      ? screenStream
      : peers[screenSharingId]?.stream;

const { [screenSharingId]: sharing, ...peersToShow } = peers;
return (
  <div className="flex flex-col min-h-screen">
      <div className="bg-red-500 p-4 text-white">Room id {params.id}</div>
  

      <div className="flex grow">
          {screenSharingVideo && (
              <div className="w-4/5 pr-4">
                  <VideoPlayer stream={screenSharingVideo} />
              </div>
          )}
          <div
              className={`grid gap-4 ${
                  screenSharingVideo ? "w-1/5 grid-col-1" : "grid-cols-4"
              }`}
          >
              {screenSharingId !== userId && (
                  <div>
                      <VideoPlayer stream={stream} />
                      <NameInput />
                  </div>
              )}

              {/* {Object.values(peersToShow as PeerState)
                  .filter((peer) => !!peer.stream)
                  .map((peer) => (
                      <div key={peer.peerId}>
                          <VideoPlayer stream={peer.stream} />
                          <div>{peer.userName}</div>
                      </div>
                  ))} */}
          </div>
          {chat.isChatOpen && (
              <div className="border-l-2 pb-28">
                  <Chat />
              </div>
          )}
      </div>
      <div className="h-28 fixed bottom-0 p-6 w-full flex items-center justify-center border-t-2 bg-white">
          {/* <ShareScreenButton onClick={shareScreen} /> */}
          <ChatButton onClick={toggleChat} />
      </div>
  </div>
);
};

export default Page;
