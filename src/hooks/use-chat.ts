import { dummyInitialChatMessages } from "@/utils/constants";
import type { ChatMessage, MeetingUser } from "@/utils/types";
import { useCallback, useState } from "react";

export const useChat = (_roomId: string, user: MeetingUser) => {
  const [messages, setMessages] = useState<ChatMessage[] | []>(dummyInitialChatMessages);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !user) return;

      const message = {
        id: Date.now().toString(),
        text: text.trim(),
        senderName: user.fullName ?? "You",
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
