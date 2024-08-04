import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const rooms: Record<string, Record<string, IUser>> = {};
const chats: Record<string, IMessage[]> = {};

interface IUser {
  peerId: string;
  userName: string;
  stream: MediaStream;
}

interface RoomParams {
  roomId: string;
  peerId: string;
  stream: MediaStream;
}

interface IMessage {
  content: string;
  author?: string;
  timestamp: number;
}

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidv4();
    rooms[roomId] = {};
    socket.emit("room-created", { roomId });
  };

  const joinRoom = ({ roomId, peerId, stream }: RoomParams) => {
    console.log({ roomId, peerId });
    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId][peerId] = { peerId, userName: "name", stream };
    socket.emit("get-messages", chats[roomId]);
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { roomId, peerId });
    socket.emit("get-users", { roomId, participants: rooms[roomId] });

    socket.on("disconnect", () => {
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ roomId, peerId }: { roomId: string; peerId: string }) => {
    if (rooms[roomId]) {
      delete rooms[roomId][peerId];
      socket.to(roomId).emit("user-disconnected", peerId);
    }
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};
