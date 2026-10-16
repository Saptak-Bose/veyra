import MeetingRoom from "@/components/meeting/meeting-room";
import { dummyMeetingDetails, dummyUser } from "@/utils/constants";
import { auth } from "@clerk/nextjs/server";

type Props = {
  params: Promise<{
    meetingId: string;
  }>;
};

export default async function MeetingRoomPage({ params }: Props) {
  await auth.protect();

  const { meetingId } = await params;
  const user = dummyUser;

  return (
    <div className="h-screen w-screen bg-slate-100 text-slate-900 flex flex-col overflow-hidden relative font-sans">
      <header className="w-full bg-white/90 backdrop-blur-md px-6 py-3 border-b border-slate-200 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">
            {dummyMeetingDetails.title} (
            {meetingId ?? dummyMeetingDetails.meetingId})
          </h2>
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </header>
      <MeetingRoom user={user} meetingId={meetingId} />
    </div>
  );
}
