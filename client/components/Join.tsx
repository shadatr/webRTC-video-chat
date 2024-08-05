import { useContext } from "react";
import { NameInput } from "../common/Name";
import { RoomContext } from "@/context/RoomContext";

export const Join: React.FC = () => {
    const {ws} = useContext(RoomContext);

    const createRoom = () => {
        if (ws) {
            ws.emit("create-room");
        } else {
            console.error("WebSocket connection is not available");
          }
    };
    return (
        <div className=" flex flex-col">
            <NameInput />
            <button onClick={createRoom} className="py-2 px-8 text-xl">
                Start new meeting
            </button>
        </div>
    );
};
