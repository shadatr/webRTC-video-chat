import { useContext } from "react";
import { ws } from "../ws";
import { UserContext } from "../context/UserContext";
import { toast } from "sonner";

export const Create = () => {
    const { userName, setUserName } = useContext(UserContext);

    const createRoom = () => {
        if (!userName) {
            toast.error("Please enter your name");
            return;
          }
        ws.emit("create-room");
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
     
        <button
          onClick={createRoom}
          className="py-2 px-8 text-xl w-full bg-blue-800 text-white rounded-lg"
        >
          Create meeting
        </button>
        <a href="/" className="text-blue-700">
          Join meeting
        </a>
      </div>
    </div>
    );
};


