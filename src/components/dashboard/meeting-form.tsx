"use client";

import { ArrowRightIcon, KeyboardIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";

type Props = object;

export default function MeetingForm({}: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [joinId, setJoinId] = useState("");
  const router = useRouter();

  const handleCreateMeeting = () => {
    setIsCreating(true);

    const chars = "abcdefghijklmnopqrstuvwxyz";

    const seg = () =>
      Array.from(
        {
          length: 3,
        },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join("");

    const newMeetingId = `${seg()}-${seg()}-${seg()}`;

    setTimeout(() => {
      setIsCreating(false);
      toast.success("Meeting created successfully!", {
        position: "top-center",
        richColors: true,
      });
      router.push(`/meeting/${newMeetingId}`);
    }, 400);
  };

  const handleJoinMeeting = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanId = joinId.trim();

    if (!/^[a-z]{3}(?:-[a-z]{3}){2}$/.test(cleanId)) {
      toast.error("Please enter a valid meeting code.", {
        position: "top-center",
        richColors: true,
      });

      return;
    }

    router.push(`/meeting/${encodeURIComponent(cleanId)}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
      <button
        onClick={handleCreateMeeting}
        disabled={isCreating}
        className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-3.5 rounded-full shadow-md shadow-primary/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
      >
        <PlusIcon className="w-5 h-5" />
        <span>{isCreating ? "Creating..." : "New meeting"}</span>
      </button>
      <form
        onSubmit={handleJoinMeeting}
        className="flex-1 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <KeyboardIcon className="w-5 h-5 text-primary/90 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            className="w-full bg-white/75 border border-primary-border/80 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 rounded-full pl-12 pr-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
            type="text"
            placeholder="Enter the code to join a meeting (e.g., abc-def-ghi)"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={!joinId.trim()}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 text-white font-medium px-6 py-3.5 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-xs"
        >
          <span>Join</span>
          <ArrowRightIcon className="w-4 h-4 ml-1.5" />
        </button>
      </form>
    </div>
  );
}
