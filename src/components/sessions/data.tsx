"use client";

import { dummySessions } from "@/utils/constants";
import type { Session } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EmptySessions from "./empty-sessions";
import SessionCard from "./session-card";
import SessionDetailModal from "./session-detail-modal";

type Props = object;

export default function SessionsData({}: Props) {
  const [sessions] = useState<Session[] | [] | null>(dummySessions as Session[]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const router = useRouter();

  const openSessionDetails = (sessionId: number) => {
    const session = sessions?.find((s) => s.id === sessionId);

    if (session) {
      setSelectedSession(session);
    }
  };

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
