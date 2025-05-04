import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

export const userSocketMap: Map<string, string> = new Map();

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "new-chat-msg": (data: {
    senderId: string;
    receiverId: string;
    message: string | null;
    image: string | null;
    createdAt: string;
  }) => void;
  "online-users": (data: { user_ids: string[] }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  "register-socket": (data: { user_id: number }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

let io: Server<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents
> | null = null;

export const initSocketIO = (
  httpServer: HttpServer
): Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents> => {
  io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents
  >(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
      credentials: true,
    },
  });

  console.log("Socket.IO has been initialized");

  io.on(
    "connection",
    (
      socket: Socket<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents
      >
    ) => {
      console.log(`Client connected: ${socket.id}`);

      const userId: string = socket.handshake.query.userId as string;

      userSocketMap.set(userId, socket.id);

      // Handle client-to-server events
      socket.on("hello", () => {
        console.log("Client says hello!");
      });

      const io = getSocketIO();

      io.emit("online-users", {
        user_ids: Array.from(userSocketMap.keys()),
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        for (let [userId, socketId] of userSocketMap) {
          if (socket.id === socketId) {
            userSocketMap.delete(userId);
            break;
          }
        }
        io.emit("online-users", {
          user_ids: Array.from(userSocketMap.keys()),
        });
      });
    }
  );

  return io;
};

export const getSocketIO = (): Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
> => {
  if (!io) {
    throw new Error("Socket.IO not initialized. Call initSocketIO first.");
  }
  return io;
};
