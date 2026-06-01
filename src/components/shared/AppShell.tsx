"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import { ToastContainer } from "@/components/ui/Toast";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      <main className={isLoginPage ? "" : "pb-[72px]"}>{children}</main>
      {!isLoginPage && <BottomNav />}
      <ToastContainer />
    </>
  );
}
