import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { IMessage } from "../../types/chat";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { UserContext } from "../../context/UserContext";

export const Chat: React.FC = () => {
  const { chat } = useContext(ChatContext);
  const { userId } = useContext(UserContext);

  console.log("messages", chat);
  console.log("userId", userId);

  return (
    <div className="flex flex-col justify-between w-full">
      <div className="h-[25vw] overflow-y-auto">
        {chat.messages.map((message: IMessage) => (
          <ChatBubble
            message={message}
            key={message.timestamp + (message?.author || "anonymous")}
          />
        ))}
      </div>
      <ChatInput />
    </div>
  );
};
