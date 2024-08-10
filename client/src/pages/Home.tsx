import { ws } from "../ws";
import { UserContext } from "../context/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Home = () => {
  const { userName, setUserName, userId } = useContext(UserContext);
  const [roomId, setRoomId] = useState("");
  const [errorOccurred, setErrorOccurred] = useState(false);
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    let errorTimeout: NodeJS.Timeout | null = null;

    const handleError = (data: any) => {
      setErrorOccurred(true);
      toast.error(data.message);
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    };

    const handleNoError = () => {
      if (!errorOccurred) {
        navigate(`/room/${roomId}`);
      }
    };

    ws.on("error", handleError);

    if (joined && roomId) {
      errorTimeout = setTimeout(handleNoError, 3000);
    }

    return () => {
      ws.off("error", handleError);
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    };
  }, [joined, roomId, navigate, errorOccurred]);

  const enterRoom = () => {
    if (!userName) {
      toast.error("Please enter your name");
      return;
    }
    if (!roomId) {
      toast.error("Please enter room id");
      return;
    }

    // Emit join-room event and set joined state to true
    ws.emit("join-room", { roomId, peerId: userId, userName });
    setJoined(true);
    setErrorOccurred(false); // Reset error state
  };

  return (
    <div className=" flex justify-center items-center gap-16 h-[40vw]">
      <div className="flex flex-col w-[600px] gap-5">
        <div className="text-blue-700 text-[40px] font-semibold">
          Your Ultimate chat and Video Conferencing Solution!
        </div>
        <div className=" font-semibold text-[20px]">
          Whether for business meetings, virtual events, or catching up with
          friends and family, SyncTalk offers seamless video conferencing and
          collaboration tools designed for every need.
        </div>
      </div>
      <div className=" flex flex-col justify-center items-center gap-3 w-[450px]">
        <input
          className="border border-blue-200 rounded-md py-2 px-4 w-full"
          placeholder="Enter your name"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
        <input
          type="text"
          className="border border-blue-200 rounded-md py-2 px-4 w-full "
          placeholder="Enter room id"
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button
          onClick={enterRoom}
          className="py-2 px-8 text-xl w-full bg-blue-800 text-white rounded-lg"
        >
          join meeting
        </button>
        <a href="/create" className="text-blue-700">
          create new meeting
        </a>
      </div>
    </div>
  );
};
