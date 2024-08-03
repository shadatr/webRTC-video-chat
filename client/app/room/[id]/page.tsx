"use client";
import { Chat } from "@/components/chat/Chat";
import { VideoPlayer } from "@/components/VideoPlayer";
import { PeerState } from "@/reducers/peerReducer";
import { RoomContext } from "@/context/RoomContext";
import React, { useContext, useEffect } from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const { ws, me, stream, peers } = useContext(RoomContext);

  useEffect(() => {
    if (me) ws.emit("join-room", { roomId: params.id, peerId: me._id });
  }, [ws, me, params.id]);

  return (
    <div>
      <h1>Room {params.id}</h1>
      <div className="border-l-2 pb-28">
        <Chat />
      </div>
      <VideoPlayer stream={stream} />
      {Object.values(peers as PeerState)
        .filter((peer) => !!peer.stream)
        .map((peer, index) => (
          <div key={index}>
            <VideoPlayer stream={peer.stream} />
          </div>
        ))}
    </div>
  );
};

export default Page;
