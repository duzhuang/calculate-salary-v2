"use client";

import Card from "@/components/ui/Card";
import { ChevronRight } from "lucide-react";

interface MonthCardProps {
  month: string;
  year: string;
  totalPeriod: number;
  totalSalary: number;
  dayCount: number;
  onClick?: () => void;
}

export default function MonthCard({
  month,
  year,
  totalPeriod,
  totalSalary,
  dayCount,
  onClick,
}: MonthCardProps) {
  return (
    <Card onClick={onClick} className="mb-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-gray-900 mb-2">
            {parseInt(month)}月
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-1">
            ¥{totalSalary.toLocaleString("zh-CN")}
          </div>
          <div className="text-sm text-gray-500">
            {totalPeriod}课时 · {dayCount}天教学
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Card>
  );
}
