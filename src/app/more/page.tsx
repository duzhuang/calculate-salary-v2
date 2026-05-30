"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/ui/Header";
import {
  Download,
  Upload,
  Moon,
  Sun,
  Info,
  ChevronRight,
  LogOut,
} from "lucide-react";

export default function MorePage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  // 从 localStorage 读取深色模式状态
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // 切换深色模式
  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem("darkMode", String(newValue));
    document.documentElement.classList.toggle("dark", newValue);
  };

  // 登出
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("登出失败:", error);
    }
  };

  const menuItems = [
    {
      icon: <Download className="w-5 h-5 text-teal-600" />,
      label: "导出 Excel",
      href: "/export",
    },
    {
      icon: <Upload className="w-5 h-5 text-teal-600" />,
      label: "导入 Excel",
      href: "/import",
    },
  ];

  return (
    <div>
      <Header title="更多" />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* 菜单列表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between p-4 min-h-[56px] hover:bg-gray-50 transition-colors
                ${index < menuItems.length - 1 ? "border-b border-gray-100" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-gray-900">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          ))}

          {/* 深色模式开关 */}
          <div className="flex items-center justify-between p-4 min-h-[56px] border-b border-gray-100">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-teal-600" />
              ) : (
                <Sun className="w-5 h-5 text-teal-600" />
              )}
              <span className="text-gray-900">深色模式</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                darkMode ? "bg-teal-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                  darkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 关于 */}
          <div className="flex items-center justify-between p-4 min-h-[56px] border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-teal-600" />
              <span className="text-gray-900">关于</span>
            </div>
            <span className="text-sm text-gray-500">v1.0.0</span>
          </div>

          {/* 登出 */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 min-h-[56px] hover:bg-red-50 transition-colors text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>退出登录</span>
          </button>
        </div>

        {/* 版权信息 */}
        <div className="text-center text-sm text-gray-400 mt-8">
          家教薪资助手 © 2026
        </div>
      </div>
    </div>
  );
}
