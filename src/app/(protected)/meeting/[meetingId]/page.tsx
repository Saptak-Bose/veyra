import MeetingRoom from "@/components/meeting/meeting-room";
import type {
  MeetingResponse,
  MeetingUser,
  MeetingWithDetails,
} from "@/utils/types";
import { getApiErrorMessage } from "@/utils/api-error";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "@/config/api";
import ErrorToast from "@/components/global/error-toast";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    meetingId: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function MeetingRoomPage({ params }: Props) {
  await auth.protect();

  const { meetingId } = await params;
  const user = await currentUser();

  if (!user) {
    throw new Error("Authenticated user could not be loaded.");
  }

  const meetingUser: MeetingUser = {
    id: user.id,
    fullName:
      user.fullName ??
      user.firstName ??
      user.emailAddresses[0]?.emailAddress.split("@")[0] ??
      "User",
    email: user.emailAddresses[0]?.emailAddress ?? "",
    image: user.imageUrl ?? "",
  };

  const { getToken } = await auth();
  const token = await getToken();
  let meetingData: MeetingWithDetails | null = null;
  let statsError: string | null = null;
  let meetingError: string | null = null;

  try {
    const { data } = await api.get<MeetingResponse>(`/meetings/${meetingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { meeting } = data;

    if (meeting.status === "ended") {
      meetingError = "This meeting has already ended.";
      return;
    }

    meetingData = meeting;
  } catch (error) {
    statsError = getApiErrorMessage(error);

    console.error("Error fetching meeting stats:", error);
  }

  return (
    <div className="h-screen w-screen bg-slate-100 text-slate-900 flex flex-col overflow-hidden relative font-sans">
      {statsError && <ErrorToast message={statsError} /> &&
        redirect("/dashboard")}
      {meetingError && <ErrorToast message={meetingError} /> &&
        redirect("/dashboard")}
      <header className="w-full bg-white/90 backdrop-blur-md px-6 py-3 border-b border-slate-200 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">
            {meetingData?.title} ({meetingId ?? meetingData?.meetingId})
          </h2>
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </header>
      <MeetingRoom
        meetingData={meetingData}
        user={meetingUser}
        meetingId={meetingId}
      />
    </div>
  );
}
