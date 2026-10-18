"use client";

import { useWebRTC } from "@/hooks/use-webrtc";
import { dummyMeetingDetails } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import VideoGrid from "./video-grid";
import ChatPanel from "./chat-panel";
import { useChat } from "@/hooks/use-chat";
import ParticipantList from "./participant-list";
import ControlBar from "./control-bar";
import { toast } from "sonner";
import type { MeetingUser } from "../../utils/types";

type Props = {
  user: MeetingUser;
  meetingId: string;
};

export default function MeetingRoom({ meetingId, user }: Props) {
  const router = useRouter();
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const isHost = true;

  const handleMeetingEnded = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const {
    audioEnabled,
    endMeeting,
    localStream,
    remoteUsers,
    toggleAudio,
    toggleVideo,
    videoEnabled,
  } = useWebRTC(meetingId, user, handleMeetingEnded);

  const { isChatOpen, messages, sendMessage, toggleChat, unreadCount } =
    useChat(meetingId, user);

  const handleLeave = () => {
    toast.error("You have left the meeting.", {
      richColors: true,
      position: "top-center",
    });

    router.push("/dashboard");
  };

  const handleEndMeeting = () => {
    endMeeting();

    toast.error("Meeting ended for all participants.", {
      richColors: true,
      position: "top-center",
    });

    router.push("/dashboard");
  };

  return (
    <>
      <div className="flex-1 flex overflow-hidden relative">
        <VideoGrid
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          localStream={localStream}
          localUser={user}
          remoteUsers={remoteUsers}
        />
        <ChatPanel
          currentUser={user}
          isOpen={isChatOpen}
          messages={messages}
          onSendMessage={sendMessage}
          onClose={toggleChat}
        />
        <ParticipantList
          isOpen={isParticipantsOpen}
          onClose={() => setIsParticipantsOpen(false)}
          localUser={user}
          localAudio={audioEnabled}
          localVideo={videoEnabled}
          remoteUsers={remoteUsers}
          meetingHostId={user.id}
        />
      </div>
      <ControlBar
        roomId={meetingId ?? dummyMeetingDetails.meetingId}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleChat={toggleChat}
        onToggleParticipants={() => setIsParticipantsOpen((prev) => !prev)}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantsOpen}
        unreadCount={unreadCount}
        participantCount={1 + remoteUsers.length}
        isHost={isHost}
        onLeave={handleLeave}
        onEndMeeting={handleEndMeeting}
      />
    </>
  );
}
