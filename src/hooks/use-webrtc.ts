import { socket } from "@/config/socket";
import type { MeetingParticipant, MeetingUser } from "@/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ICE_SERVERS = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "stun:stun1.l.google.com:19302",
    },
    {
      urls: "stun:stun2.l.google.com:19302",
    },
  ],
};

export const useWebRTC = (
  roomId: string,
  user: MeetingUser,
  onMeetingEnded: (message?: string) => void,
  enabled: boolean = true,
) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<MeetingParticipant[] | []>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const peersRef = useRef(new Map());
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
    } catch (error) {
      toast.error("Could not access camera/microphone", {
        position: "bottom-center",
        richColors: true,
      });

      console.error("Media devices access error:", error);

      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        localStreamRef.current = audioStream;
        setLocalStream(audioStream);
        setVideoEnabled(false);

        return audioStream;
      } catch (error) {
        console.error("Audio-only fallback error:", error);
        return null;
      }
    }

    return null;
  }, []);

  const createPeerConnection = useCallback(
    (targetSocketId: string, targetUser: MeetingParticipant) => {
      if (peersRef.current.has(targetSocketId))
        return peersRef.current.get(targetSocketId);

      const peer = new RTCPeerConnection(ICE_SERVERS);

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          peer.addTrack(track, localStreamRef.current!);
        });
      }

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            targetSocketId,
            senderSocketId: socket.id,
            candidate: event.candidate,
          });
        }
      };

      peer.ontrack = (event) => {
        const remoteStream = event.streams[0];

        setRemoteUsers((prev) => {
          const existingIndex = prev.findIndex(
            (u) => u.socketId === targetSocketId,
          );

          if (existingIndex > -1) {
            const updated = [...prev];

            updated[existingIndex] = {
              ...updated[existingIndex],
              stream: remoteStream,
            };

            return updated;
          } else {
            return [
              ...prev,
              {
                socketId: targetSocketId,
                userId: targetUser?.userId,
                userName: targetUser?.userName ?? "Participant",
                stream: remoteStream,
                audioEnabled: targetUser?.audioEnabled ?? true,
                videoEnabled: targetUser?.videoEnabled ?? true,
              },
            ];
          }
        });
      };

      peersRef.current.set(targetSocketId, peer);

      return peer;
    },
    [],
  );

  useEffect(() => {
    if (!roomId || !user || !enabled) return;

    let isMounted = true;
    const peers = peersRef.current;

    const startSession = async () => {
      await initLocalStream();

      if (!isMounted) return;

      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("join-room", {
        roomId,
        user: {
          id: user.id,
          name: user.fullName,
          email: user.email,
        },
        audioEnabled: true,
        videoEnabled: true,
      });

      socket.on("all-users", (existingUsers: MeetingParticipant[]) => {
        existingUsers.forEach((existingUser) => {
          const peer = createPeerConnection(
            existingUser.socketId,
            existingUser,
          );

          peer
            .createOffer()
            .then((offer: RTCSessionDescriptionInit) =>
              peer.setLocalDescription(offer),
            )
            .then(() => {
              socket.emit("offer", {
                targetSocketId: existingUser.socketId,
                callerSocketId: socket.id,
                sdp: peer.localDescription,
              });
            })
            .catch((err: unknown) =>
              console.error("Error creating offer:", err),
            );
        });
      });

      socket.on("user-joined", (newUser: MeetingParticipant) => {
        toast(`${newUser.userName} joined the meeting`, {
          icon: "👋",
          richColors: true,
          position: "bottom-center",
        });

        createPeerConnection(newUser.socketId, newUser);
      });

      socket.on(
        "offer",
        async ({
          callerSocketId,
          sdp,
          callerUser,
        }: {
          callerSocketId: string;
          sdp: RTCSessionDescriptionInit;
          callerUser: MeetingParticipant;
        }) => {
          const peer = createPeerConnection(callerSocketId, callerUser);

          try {
            await peer.setRemoteDescription(new RTCSessionDescription(sdp));

            const answer = await peer.createAnswer();

            await peer.setLocalDescription(answer);

            socket.emit("answer", {
              targetSocketId: callerSocketId,
              responderSocketId: socket.id,
              sdp: peer.localDescription,
            });
          } catch (err) {
            console.error("Error handling offer:", err);
          }
        },
      );

      socket.on(
        "answer",
        async ({
          responderSocketId,
          sdp,
        }: {
          responderSocketId: string;
          sdp: RTCSessionDescriptionInit;
        }) => {
          const peer = peersRef.current.get(responderSocketId);

          if (peer) {
            try {
              await peer.setRemoteDescription(new RTCSessionDescription(sdp));
            } catch (err) {
              console.error(
                "Error setting remote description from answer:",
                err,
              );
            }
          }
        },
      );

      socket.on(
        "ice-candidate",
        async ({
          senderSocketId,
          candidate,
        }: {
          senderSocketId: string;
          candidate: RTCIceCandidateInit;
        }) => {
          const peer = peersRef.current.get(senderSocketId);

          if (peer && candidate) {
            try {
              await peer.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              console.error("Error adding ICE candidate:", err);
            }
          }
        },
      );

      socket.on(
        "user-toggled-audio",
        ({
          socketId,
          audioEnabled,
        }: {
          socketId: string;
          audioEnabled: boolean;
        }) => {
          setRemoteUsers((prev) =>
            prev.map((u) =>
              u.socketId === socketId
                ? {
                    ...u,
                    audioEnabled,
                  }
                : u,
            ),
          );
        },
      );

      socket.on(
        "user-toggled-video",
        ({
          socketId,
          videoEnabled,
        }: {
          socketId: string;
          videoEnabled: boolean;
        }) => {
          setRemoteUsers((prev) =>
            prev.map((u) =>
              u.socketId === socketId
                ? {
                    ...u,
                    videoEnabled,
                  }
                : u,
            ),
          );
        },
      );

      socket.on(
        "user-left",
        ({
          socketId,
          user: leftUser,
        }: {
          socketId: string;
          user: MeetingParticipant;
        }) => {
          if (leftUser) {
            toast(`${leftUser.userName} left the meeting`, {
              position: "bottom-center",
              richColors: true,
            });
          }

          const peer = peersRef.current.get(socketId);

          if (peer) {
            peer.close();
            peersRef.current.delete(socketId);
          }

          setRemoteUsers((prev) => prev.filter((u) => u.socketId !== socketId));
        },
      );

      socket.on("meeting-ended", ({ message }: { message: string }) => {
        toast.error(message ?? "This meeting has ended", {
          position: "bottom-center",
          richColors: true,
        });

        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        peersRef.current.forEach((peer) => peer.close());
        peersRef.current.clear();
        setRemoteUsers([]);
        socket.disconnect();

        if (onMeetingEnded) {
          onMeetingEnded(message);
        }
      });
    };

    startSession();

    return () => {
      isMounted = false;

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      peers.forEach((peer) => peer.close());
      peers.clear();
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-toggled-audio");
      socket.off("user-toggled-video");
      socket.off("user-left");
      socket.off("meeting-ended");
      socket.disconnect();
    };
  }, [
    roomId,
    user,
    enabled,
    createPeerConnection,
    initLocalStream,
    onMeetingEnded,
  ]);

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];

      if (audioTrack) {
        const newState = !audioEnabled;

        audioTrack.enabled = newState;
        setAudioEnabled(newState);

        socket.emit("toggle-audio", {
          roomId,
          audioEnabled: newState,
        });
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];

      if (videoTrack) {
        const newState = !videoEnabled;

        videoTrack.enabled = newState;
        setVideoEnabled(newState);

        socket.emit("toggle-video", {
          roomId,
          videoEnabled: newState,
        });
      }
    }
  };

  const endMeeting = useCallback(() => {
    if (roomId) {
      socket.emit("end-meeting", {
        roomId,
      });
    }
  }, [roomId]);

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
