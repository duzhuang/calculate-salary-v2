"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  BarChart3,
  PlusCircle,
  Users,
  MoreHorizontal,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Calendar, label: "记录" },
  { href: "/overview", icon: BarChart3, label: "总览" },
  { href: "/record", icon: PlusCircle, label: "记账", isPrimary: true },
  { href: "/students", icon: Users, label: "学生" },
  { href: "/more", icon: MoreHorizontal, label: "更多" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-[60px] min-w-[64px] py-1
                ${active ? "text-teal-600" : "text-gray-500"}
                ${item.isPrimary ? "relative" : ""}
              `}
            >
              {item.isPrimary ? (
                <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center -mt-4 shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <Icon
                  className={`w-5 h-5 ${active ? "text-teal-600" : "text-gray-500"}`}
                />
              )}
              <span
                className={`text-xs mt-0.5 ${item.isPrimary ? "mt-1" : ""} ${active ? "text-teal-600 font-medium" : "text-gray-500"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
