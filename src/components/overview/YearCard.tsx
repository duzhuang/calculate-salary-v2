"use client";

import Card from "@/components/ui/Card";
import { formatSalary } from "@/lib/constants";
import { ChevronRight } from "lucide-react";

interface YearCardProps {
  year: string;
  totalPeriod: number;
  totalSalary: number;
  onClick?: () => void;
}

export default function YearCard({
  year,
  totalPeriod,
  totalSalary,
  onClick,
}: YearCardProps) {
  return (
    <Card onClick={onClick} className="mb-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-gray-900 mb-2">
            {year} 年度
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-1">
            ¥{formatSalary(totalSalary)}
          </div>
          <div className="text-sm text-gray-500">{totalPeriod}课时</div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Card>
  );
}
