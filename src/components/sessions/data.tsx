"use client";

import type { Session, SessionResponse, SessionsResponse } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EmptySessions from "./empty-sessions";
import SessionCard from "./session-card";
import SessionDetailModal from "./session-detail-modal";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/config/api";
import { getApiErrorMessage } from "@/utils/api-error";
import { toast } from "sonner";
import Loader from "../global/loader";

type Props = object;

export default function SessionsData({}: Props) {
  const [sessions, setSessions] = useState<Session[] | []>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = await getToken();

        const { data } = await api.get<SessionsResponse>("/meetings/sessions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSessions(data.meetings);
      } catch (error) {
        const errorMessage = getApiErrorMessage(error);

        toast.error(`Failed to fetch sessions. ${errorMessage}`, {
          position: "bottom-center",
          richColors: true,
        });

        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [getToken]);

  const openSessionDetails = async (sessionId: number) => {
    try {
      const token = await getToken();

      const { data } = await api.get<SessionResponse>(
        `/meetings/sessions/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSelectedSession(data.meeting);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);

      toast.error(`Failed to fetch session details. ${errorMessage}`, {
        position: "bottom-center",
        richColors: true,
      });

      console.error("Error fetching session details:", error);
    }
  };

  if (loading) return <Loader text="Fetching meeting details..." />;

  return (
    <>
      {sessions?.length === 0 ? (
        <EmptySessions />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions?.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onOpenDetails={openSessionDetails}
              onRejoin={(meetingId) => router.push(`/meeting/${meetingId}`)}
            />
          ))}
        </div>
      )}
      <SessionDetailModal
        session={selectedSession!}
        onClose={() => setSelectedSession(null)}
      />
    </>
  );
}
