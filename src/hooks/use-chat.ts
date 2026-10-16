import { dummyInitialChatMessages, dummyUser } from "@/utils/constants";
import { useCallback, useState } from "react";

export const useChat = (_roomId: string, user: typeof dummyUser) => {
  const [messages, setMessages] = useState(dummyInitialChatMessages);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !user) return;

      const message = {
        id: Date.now().toString(),
        text: text.trim(),
        senderName: user.name ?? user.fullName ?? "You",
        senderId: user.id,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prevMessages) => [...prevMessages, message]);
    },
    [user],
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
