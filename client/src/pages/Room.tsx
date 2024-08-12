import { useContext, useEffect, useState } from "react";
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
import { ImPhoneHangUp } from "react-icons/im";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { PiMicrophoneBold } from "react-icons/pi";
import { BiMicrophoneOff } from "react-icons/bi";

export const Room = () => {
  const { id } = useParams();
  const {
    stream,
    setStream,
    screenStream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
    meetingName,
  } = useContext(RoomContext);
  const { userName, userId } = useContext(UserContext);

  const [isMuted, setIsMuted] = useState(stream?.active&&stream?.getAudioTracks()[0].enabled);
  const [isRecording, setIsRecording] = useState(stream?.active ? false : true);
  console.log({ stream });
  useEffect(() => {
    ws.emit("join-room", { roomId: id, peerId: userId, userName });
  }, [id, userId, stream, userName]);

  useEffect(() => {
    setRoomId(id || "");
  }, [id, setRoomId, isMuted,isRecording,peers]);

  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

  const toggleMute = () => {
    const audioTracks = stream?.getAudioTracks();
    audioTracks?.forEach((track) => {
      track.enabled = !isMuted;
    });
    setIsMuted(!isMuted);
  };

  const toggleRecord = async () => {
    if (isRecording) {
      if (stream) {
        stream.getVideoTracks().forEach((track) => track.stop());
      }
      setStream(undefined);
    } else {
      try {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            setStream(stream);
          });
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    }
    setIsRecording(!isRecording);
  };

  //   const { [screenSharingId]: sharing, ...peersToShow } = peers;
  return (
    <div className="relative min-h-screen bg-black pl-4 gap-10 flex">
      <div>
        <div className="text-white  font-medium p-2">{meetingName}</div>
        <div className="flex flex-col gap-3 ">
          <div className="w-[65vw] h-[37vw]">
            {stream?.active ? (
              <VideoPlayer
                stream={stream}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-full object-cover rounded-2xl flex justify-center items-center bg-white bg-opacity-10">

                <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${userName}`}
                  className="rounded-full w-24 h-24"
                />
              </div>
            )}
          </div>
          <div className="w-[65vw] overflow-y-auto whitespace-nowrap flex gap-3">
            {Object.values(peers as PeerState)
            .filter((peer) => peer.peerId!=userId)
              .map((peer) => (
                
                <div
                  key={peer.peerId}
                  className="relative inline-block h-[12vw] w-[16vw]"
                >
                  {peer.stream?
                    <VideoPlayer
                      stream={peer.stream}
                      className=" h-[12vw] w-[16vw] rounded-2xl"
                    />
                  :
                  <div className="w-full h-full object-cover rounded-2xl flex justify-center items-center bg-white bg-opacity-10">

                <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${peer.userName}`}
                  className="rounded-full w-12 h-12"
                />
              </div>}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-20 bg-blur-sm text-white px-2 py-1 rounded-full text-sm">
                    {peer.userName}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className=" ml-4 bg-white w-full z-20">
        <div className="h-[24vw] border-b px-5 py-3">
          <p className="text-xl font-medium text-gray-500 pb-2">
            Particiants {Object.values(peers as PeerState).length - 1}
          </p>
          {Object.values(peers as PeerState)
            .filter((peer) => !!peer.stream)
            .map((peer) => (
              <div key={peer.peerId} className="flex items-center gap-2 ">
                <img
                  className="w-8 h-8 rounded-full"
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${peer.userName}`}
                  alt="avatar"
                />
                <div>{peer.userName}</div>
              </div>
            ))}
        </div>
        <Chat />
      </div>

      <div className="h-16 fixed bottom-0 p-2 w-full flex items-center justify-center shadow-md ">
        <div className="flex gap-4">
          <span
            className="bg-gray-900 p-2 rounded-full bg-opacity-80"
            onClick={toggleRecord}
          >
            {isRecording ? (
              <FaVideo className="text-white text-4xl" />
            ) : (
              <FaVideoSlash className="text-white text-4xl" />
            )}
          </span>
          <span className="bg-gray-900 p-2 rounded-full" onClick={toggleMute}>
            {isMuted ? (
              <BiMicrophoneOff className="text-white text-4xl" />
            ) : (
              <PiMicrophoneBold className="text-white text-4xl" />
            )}
          </span>

          <a
            href="/"
            className="bg-red-600 p-2 rounded-full"
            onClick={() => setStream(undefined)}
          >
            <ImPhoneHangUp className="text-white text-4xl " />
          </a>
        </div>
      </div>
    </div>
  );
};
