import { io } from "socket.io-client";

const SOCKET_URL =
  (process.env.NEXT_PUBLIC_SOCKET_APP_URL as string) ?? "http://localhost:3001";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});
