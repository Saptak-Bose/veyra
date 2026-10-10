"use client";

import { navLinks } from "@/utils/constants";
import { UserButton, useUser } from "@clerk/nextjs";
import { HistoryIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = object;

export default function Navbar({}: Props) {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const username =
    user?.username ??
    user?.fullName ??
    user?.firstName ??
    user?.emailAddresses[0]?.emailAddress?.split("@")[0] ??
    "User";

  return (
    <header className="w-full max-w-305 mx-auto bg-white/90 backdrop-blur xl:rounded-b-xl sticky top-0 z-40 px-6 py-4 flex items-center justify-between border border-slate-200">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-1.5">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={26}
            height={26}
            className="size-6.5"
          />
          <span className="text-2xl font-medium tracking-tight text-slate-900 flex items-center">
            Veyra<span className="text-primary">.</span>
          </span>
        </Link>
        {isSignedIn &&
          navLinks.map(({ Icon, id, label, path }) => (
            <nav key={id} className="hidden md:flex items-center gap-1.5 ml-2">
              <Link
                href={path}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  pathname === path
                    ? "ring ring-blue-100 bg-blue-50 text-slate-800"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            </nav>
          ))}
      </div>
      {isSignedIn && (
        <div className="flex items-center gap-4">
          <Link
            href="/sessions"
            className="md:hidden text-xs font-medium text-slate-600 hover:text-primary flex items-center gap-1"
          >
            <HistoryIcon className="w-4 h-4" />
            Sessions
          </Link>
          <span className="font-medium hidden sm:inline tracking-wide text-sm text-slate-700">
            Welcome, {username}
          </span>
          <UserButton />
        </div>
      )}
    </header>
  );
}
