import { socket } from "@/config/socket";
import type { ChatMessage, MeetingUser } from "@/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useChat = (roomId: string, user: MeetingUser) => {
  const [messages, setMessages] = useState<ChatMessage[] | []>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isChatOpenRef = useRef(isChatOpen);

  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
  }, [isChatOpen]);

  useEffect(() => {
    if (!roomId) return;

    const handleReceiveMessage = (msg: ChatMessage) => {
      setMessages((prevMsgs) => [...prevMsgs, msg]);

      if (!isChatOpenRef.current) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [roomId]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !user) return;

      const message = {
        id: Date.now().toString(),
        text: text.trim(),
        senderName: user.fullName ?? "You",
        senderId: user.id,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      socket.emit("send-message", {
        roomId,
        message,
      });
    },
    [user, roomId],
  );

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  }, []);

  return {
    messages,
    sendMessage,
    unreadCount,
    isChatOpen,
    toggleChat,
  };
};
