import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShareScreenButton } from "../components/ShareScreeenButton";
import { ChatButton } from "../components/ChatButton";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../reducers/peerReducer";
import { RoomContext } from "../context/RoomContext";
import { Chat } from "../components/chat/Chat";
import { ws } from "../ws";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { toast } from "sonner";

export const Room = () => {
  const { id } = useParams();
  const {
    stream,
    screenStream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
  } = useContext(RoomContext);
  const { userName, userId } = useContext(UserContext);
  const { toggleChat, chat } = useContext(ChatContext);

  useEffect(() => {
    if (stream) ws.emit("join-room", { roomId: id, peerId: userId, userName });
  }, [id, userId, stream, userName]);

  useEffect(() => {
    setRoomId(id || "");
  }, [id, setRoomId]);

  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

  const { [screenSharingId]: sharing, ...peersToShow } = peers;
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex grow ">
        {screenSharingVideo && (
          <div className="relative w-full pr-4">
            <VideoPlayer stream={screenSharingVideo} />
            {/* Optional: Overlay for screen sharing label */}
            <div className="absolute top-2 left-2 bg-black text-white text-sm px-2 py-1 rounded">
              Screen Sharing
            </div>
          </div>
        )}
        <div>
          {screenSharingId !== userId && (
            <div className="flex h-[90vh]">
              <VideoPlayer stream={stream} />
            </div>
          )}
          {Object.values(peersToShow as PeerState)
            .filter((peer) => !!peer.stream)
            .map((peer) => (
              <div
                key={peer.peerId}
                className="relative bg-white p-2 rounded shadow-md"
              >
                <VideoPlayer stream={peer.stream} />
                <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                  {peer.userName}
                </div>
              </div>
            ))}
        </div>
        {chat.isChatOpen && (
          <div className="border-l-2 border-gray-300 bg-white p-4 w-80">
            <Chat />
          </div>
        )}
      </div>
      <div className="h-20 fixed bottom-0 p-4 w-full flex items-center justify-center border-t-2 bg-white shadow-md">
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
      </div>
    </div>
  );
};
