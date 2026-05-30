"use client";

import Card from "@/components/ui/Card";

interface DayCardProps {
  date: string;
  totalPeriod: number;
  totalSalary: number;
  recordCount: number;
  onClick?: () => void;
}

export default function DayCard({
  date,
  totalPeriod,
  totalSalary,
  recordCount,
  onClick,
}: DayCardProps) {
  return (
    <Card onClick={onClick} className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">{date}</span>
        <span className="text-xs text-gray-400">{recordCount}条记录</span>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <span className="text-sm text-gray-500">课时 </span>
          <span className="text-lg font-bold text-teal-600">
            {totalPeriod}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-500">金额 </span>
          <span className="text-lg font-bold text-orange-600">
            ¥{totalSalary}
          </span>
        </div>
      </div>
    </Card>
  );
}
