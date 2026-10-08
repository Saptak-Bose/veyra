import { auth } from "@clerk/nextjs/server";

type Props = {
  params: Promise<{
    meetingId: string;
  }>;
};

export default async function MeetingRoomPage({ params }: Props) {
  await auth.protect();
  return <div>MeetingIdPage</div>;
}
