export type MeetingUser = {
  id: string;
  fullName: string | null;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
};

export type MeetingParticipant = {
  socketId: string;
  userId: string;
  userName: string;
  stream: MediaStream | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
};

export type SessionHost = {
  id: string;
  name: string;
  email: string;
};

export type SessionParticipant = {
  user: {
    id: string;
    email: string;
  };
  name: string;
  joinedAt: string;
  leftAt: string | null;
};

export type Session = {
  id: number;
  meetingId: string;
  title: string;
  status: string;
  createdAt: string;
  endedAt: string | null;
  host: SessionHost;
  participants: SessionParticipant[];
  messages: ChatMessage[];
};
