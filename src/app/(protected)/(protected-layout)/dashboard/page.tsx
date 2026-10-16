import DateTimeDialog from "@/components/dashboard/date-time-dialog";
import MeetingForm from "@/components/dashboard/meeting-form";
import { dummyStats, dummyUser } from "@/utils/constants";
import { auth } from "@clerk/nextjs/server";
import { ShieldCheckIcon } from "lucide-react";

type Props = object;

export default async function DashboardPage({}: Props) {
  await auth.protect();

  const user = dummyUser;
  const stats = dummyStats;
  const username = user?.fullName ?? "User";
  const userEmail = user?.emailAddresses[0]?.emailAddress ?? "user@gmail.com";

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 pr-6 py-2 rounded-full bg-white/25 text-xs font-medium">
              <ShieldCheckIcon size={16} />
              Secure peer-to-peer encryption
            </div>
            <h1 className="text-4xl sm:text-5xl text-slate-800 leading-tight font-medium">
              High quality video calls.
              <br />
              <span className="text-primary">Built for everyone.</span>
            </h1>
            <p className="text-slate-700 text-base sm:text-lg max-w-xl leading-relaxed">
              Connect, collaborate, and communicate with ease. Our platform
              ensures seamless video calls with top-notch security and privacy,
              making it perfect for both personal and professional use.
            </p>
            <MeetingForm />
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
          <div className="w-full bg-white/25 backdrop-blur rounded-4xl p-8 border border-slate-200 text-center space-y-6 relative overflow-hidden">
            <div className="space-y-1">
              <p className="mb-5 text-xl text-left">
                Hi, <span className="font-medium">{username}</span>
              </p>
              <DateTimeDialog />
            </div>
            <div className="pt-4 border-t border-white/30 text-sm text-slate-600">
              <div className="flex items-center justify-between py-6 px-4">
                <p>
                  Logged in as:{" "}
                  <span className="text-slate-900">{userEmail}</span>
                </p>
                <span
                  className={`px-4 py-1 rounded-full font-semibold text-xs uppercase ${stats.plan === "premium" ? "bg-blue-700 text-white" : "bg-white/70 text-slate-800"}`}
                >
                  {stats?.plan ?? "Free"}
                </span>
              </div>
              {stats && (
                <div className="w-full bg-white/50 rounded-2xl px-5 py-4 border border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span>Monthly Meetings</span>
                    <span className="text-xs text-slate-600 font-mono">
                      {stats.monthlyLimit
                        ? `${stats.monthlyCount} / ${stats.monthlyLimit} used`
                        : `${stats.monthlyCount} created (Unlimited)`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
