import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { RoomContext } from "../../context/RoomContext";
import { UserContext } from "../../context/UserContext";
import { Button } from "../common/Button";

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useContext(ChatContext);
  const { userId } = useContext(UserContext);
  const { roomId } = useContext(RoomContext);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message, roomId, userId);
          setMessage("");
        }}
      >
        <div className="flex p-1">
          <textarea
            className="border rounded px-4 w-full py-2"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Button
            type="submit"
            className="bg-blue-400 p-4 mx-2 rounded-lg text-xl hover:bg-blue-700 text-white"
          >
            send
          </Button>
        </div>
      </form>
    </div>
  );
};
