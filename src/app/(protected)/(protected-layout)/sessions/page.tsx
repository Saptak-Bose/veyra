import SessionsData from "@/components/sessions/data";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

type Props = object;

export default async function SessionsPage({}: Props) {
  await auth.protect();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12">
      <Link
        href="/dashboard"
        className="flex items-center text-sm gap-1 mb-4 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeftIcon size={14} />
        Back to Dashboard
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-slate-900 tracking-tight">
          Meeting sessions.
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your past and active meeting history, participant logs, chat
          transcripts, and more.
        </p>
      </div>
      <SessionsData />
    </main>
  );
}
