import { useContext } from "react";
import { RoomContext } from "../../context/RoomContext";
import { IMessage } from "../../types/chat";
import classNames from "classnames";
import { UserContext } from "../../context/UserContext";

export const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
    const { peers } = useContext(RoomContext);
    const { userId } = useContext(UserContext);

    // Safely access the author's userName
    const author = message.author && peers[message.author] ? peers[message.author].userName : undefined;
    const userName = author || "Anonymous"; 
    const isSelf = message.author === userId;
    const time = new Date(message.timestamp).toLocaleTimeString();

    console.log("userId", userId);

    return (
        <div
            className={classNames("m-2 flex", {
                "pl-10 justify-end": isSelf,
                "pr-10 justify-start": !isSelf,
            })}
        >
            <div className="flex flex-col max-w-[300px]">
                <div
                    className={classNames("py-2 px-4 rounded", {
                        "bg-blue-200": isSelf,
                        "bg-blue-400": !isSelf,
                    })}
                >
                    {message.content}
                    <div
                        className={classNames("text-xs opacity-50", {
                            "text-right": isSelf,
                            "text-left": !isSelf,
                        })}
                    >
                        {time}
                    </div>
                </div>
                <div
                    className={classNames("font-semibold", {
                        "text-right": isSelf,
                        "text-left": !isSelf,
                    })}
                >
                    {isSelf ? "You" : userName}
                </div>
            </div>
        </div>
    );
};
