"use client";

import {
  CheckIcon,
  CopyIcon,
  MessageSquareIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
  UsersIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  roomId: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  unreadCount: number;
  participantCount: number;
  isHost: boolean;
  onLeave: () => void;
  onEndMeeting: () => void;
};

export default function ControlBar({
  audioEnabled,
  isChatOpen,
  isHost,
  isParticipantsOpen,
  onEndMeeting,
  onLeave,
  onToggleAudio,
  onToggleChat,
  onToggleParticipants,
  onToggleVideo,
  participantCount,
  unreadCount,
  videoEnabled,
  roomId,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyMeetingId = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    toast.success("Meeting link copied to clipboard!", {
      position: "top-center",
      richColors: true,
    });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full bg-white/90 backdrop-blur-md border-t border-slate-200/80 px-6 py-4 flex items-center justify-between z-40 shadow-lg shadow-slate-200/50">
      <div className="hidden sm:flex items-center gap-3">
        <span className="text-xs font-medium text-slate-600 font-mono tracking-wider">
          Id: {roomId}
        </span>
        <button
          onClick={copyMeetingId}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all"
        >
          {copied ? (
            <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <CopyIcon className="w-3.5 h-3.5" />
          )}
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>
      <div className="flex items-center gap-3 mx-auto sm:mx-0">
        <button
          title={audioEnabled ? "Mute Microphone" : "Unmute Microphone"}
          onClick={onToggleAudio}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer border ${audioEnabled ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs" : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 shadow-xs"}`}
        >
          {audioEnabled ? (
            <MicIcon className="h-5 w-5" />
          ) : (
            <MicOffIcon className="h-5 w-5" />
          )}
        </button>
        <button
          title={videoEnabled ? "Turn off Camera" : "Turn on Camera"}
          onClick={onToggleVideo}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer border ${videoEnabled ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs" : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 shadow-xs"}`}
        >
          {videoEnabled ? (
            <VideoIcon className="h-5 w-5" />
          ) : (
            <VideoOffIcon className="h-5 w-5" />
          )}
        </button>
        <button
          title="Toggle In-meeting Chat"
          onClick={onToggleChat}
          className={`p-3.5 rounded-2xl transition-all cursor-pointer border ${isChatOpen ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs"}`}
        >
          <MessageSquareIcon className="w-5 h-5" />
          {unreadCount > 0 && !isChatOpen && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white text-xs">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          title="Toggle Participants List"
          onClick={onToggleParticipants}
          className={`relative p-3.5 rounded-2xl transition-all cursor-pointer border ${isParticipantsOpen ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs"}`}
        >
          <UsersIcon className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-slate-200 text-slate-800 text-[10px] font-bold rounded-full px-1.5 py-0.5 border border-slate-300">
            {participantCount}
          </span>
        </button>
        {isHost ? (
          <button
            onClick={onEndMeeting}
            className="p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 transition-all cursor-pointer border border-red-500 ml-2 font-medium text-xs flex items-center gap-1.5"
            title="End meeting for all participants"
          >
            <PhoneOffIcon className="h-5 w-5" />
            <span className="hidden md:inline">End Meeting</span>
          </button>
        ) : (
          <button
            onClick={onLeave}
            className="p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 transition-all cursor-pointer border border-red-500 ml-2"
            title="Leave meeting"
          >
            <PhoneOffIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="hidden sm:block w-32 text-right">
        <span className="font-medium text-slate-400">Veyra Room</span>
      </div>
    </footer>
  );
}
