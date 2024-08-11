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
    <div className="relative min-h-screen">
      {/* {screenSharingVideo && (
        <div className="w-full h-screen">
          <VideoPlayer stream={screenSharingVideo} />
          <div className="text-center mt-2">Screen Sharing</div>
        </div>
      )}
   */}
      <div className="p-4 grid grid-cols-2 inset-0 ">
        {screenSharingId !== userId && (
          <div key={userId} className="relative w-full h-[450px]">
              <VideoPlayer stream={stream} />
              <div className="absolute top-2 left-16 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                {userName}
              </div>
            </div>
        )}
        {Object.values(peersToShow as PeerState)
          .filter((peer) => !!peer.stream)
          .map((peer) => (
            <div key={peer.peerId} className="relative w-full h-[450px]">
              <VideoPlayer stream={peer.stream} />
              <div className="absolute top-2 left-16 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                {peer.userName}
              </div>
            </div>
          ))}
      </div>

      {/* Chat Section */}
      {chat.isChatOpen && (
        <div className="fixed bottom-20 right-0 p-4">
          <Chat />
        </div>
      )}

      {/* Bottom Buttons */}
      <div className="h-20 fixed bottom-0 p-4 w-full flex items-center justify-center border-t-2 bg-white shadow-md">
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
      </div>
    </div>
  );
};
