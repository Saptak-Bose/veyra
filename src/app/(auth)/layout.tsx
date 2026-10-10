import { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  return (
    <div className="min-h-screen w-full bg-login-bg text-slate-800 p-4 md:p-6 lg:p-8 flex items-center justify-center font-sans bg-cover bg-center bg-no-repeat">
      <div className="w-full flex justify-center py-2">{children}</div>
    </div>
  );
}
