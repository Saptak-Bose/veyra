import { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen font-sans bg-layout-bg bg-cover bg-center bg-no-repeat bg-slate-50 text-slate-900">
      {children}
    </div>
  );
}
