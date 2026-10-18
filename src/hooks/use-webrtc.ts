import { dummyRemoteParticipants } from "@/utils/constants";
import type { MeetingParticipant, MeetingUser } from "@/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useWebRTC = (
  _roomId: string,
  user: MeetingUser,
  onMeetingEnded: (message?: string) => void,
  _enabled: boolean = true,
) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<MeetingParticipant[] | []>(dummyRemoteParticipants);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const localStreamRef = useRef<MediaStream | null>(null);

  const initLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      return stream;
    } catch (_error) {
      console.error(
        "Mock WebRTC: Running in camera preview fallback mode",
        _error,
      );
    }

    return null;
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      initLocalStream();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [initLocalStream]);

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);

    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];

      if (audioTrack) audioTrack.enabled = newState;
    }

    toast(newState ? "Microphone unmuted" : "Microphone muted", {
      richColors: true,
      icon: newState ? "🎙️" : "🔇",
      position: "top-center",
    });
  };

  const toggleVideo = () => {
    const newState = !videoEnabled;
    setVideoEnabled(newState);

    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];

      if (videoTrack) videoTrack.enabled = newState;
    }

    toast(newState ? "Camera enabled" : "Camera disabled", {
      richColors: true,
      icon: newState ? "📹" : "📷",
      position: "top-center",
    });
  };

  const endMeeting = useCallback(() => {
    if (onMeetingEnded) {
      onMeetingEnded("Meeting ended by host.");
    }
  }, [onMeetingEnded]);

  return {
    localStream,
    remoteUsers,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
    endMeeting,
  };
};
