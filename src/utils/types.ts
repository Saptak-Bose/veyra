export type MeetingUser = {
  id: string;
  fullName: string;
  email: string;
  image: string;
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
  } | null;
  name: string;
  joinedAt: string;
  leftAt: string | null;
};

export type Session = {
  id: number;
  meetingId: string;
  title: string;
  status: "active" | "ended";
  createdAt: string;
  endedAt: string | null;
  host: SessionHost;
  participants: SessionParticipant[];
  messages: ChatMessage[];
};

export type MeetingStats = {
  plan: "essential" | "studio";
  monthlyCount: number;
  monthlyLimit: number | null;
  maxParticipants: number;
};

export type NewMeeting = {
  id: number;
  meetingId: string;
  title: string;
  status: "active" | "ended";
  createdAt: string;
  host: string;
};

export type MeetingWithDetails = {
  id: number;
  meetingId: string;
  title: string;
  status: "active" | "ended";
  createdAt: string;
  host: SessionHost;
};

export type SessionsResponse = {
  meetings: Session[];
};

export type SessionResponse = {
  meeting: Session;
};

export type MeetingResponse = {
  meeting: MeetingWithDetails;
};
