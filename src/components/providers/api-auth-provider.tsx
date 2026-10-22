"use client";

import { initializeAuthInterceptor } from "@/config/api";
import { socket } from "@/config/socket";
import { useAuth } from "@clerk/nextjs";
import { ReactNode, useEffect } from "react";

type Props = {
  children: Readonly<ReactNode>;
};

export default function ApiAuthProvider({ children }: Props) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    initializeAuthInterceptor(getToken);
  }, [getToken]);

  useEffect(() => {
    const syncSocket = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();

          if (token) {
            socket.auth = {
              token: `Bearer ${token}`,
            };

            if (!socket.connected) {
              socket.connect();
            }
          }
        } catch (error) {
          console.error(
            "Failed to authenticate Socket.io with Clerk context: ",
            error,
          );
        }
      } else {
        if (socket.connected) {
          socket.disconnect();
        }
      }
    };

    syncSocket();

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [isSignedIn, getToken]);

  return <>{children}</>;
}
