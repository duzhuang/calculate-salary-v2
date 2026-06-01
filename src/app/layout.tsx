import type { Metadata, Viewport } from "next";
import { Nunito, DM_Sans } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/shared/AppShell";

const nunito = Nunito({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "家教薪资助手",
  description: "家教薪资计算与教学记录管理",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0D9488",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${nunito.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full bg-gray-50 font-[family-name:var(--font-body)]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
