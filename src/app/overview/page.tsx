"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import YearCard from "@/components/overview/YearCard";
import EmptyState from "@/components/shared/EmptyState";
import { SummaryCardSkeleton } from "@/components/ui/Skeleton";
import { BarChart3 } from "lucide-react";

interface YearStat {
  year: string;
  totalPeriod: number;
  totalSalary: number;
}

export default function OverviewPage() {
  const router = useRouter();
  const [yearStats, setYearStats] = useState<YearStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/year")
      .then((res) => res.json())
      .then((data) => setYearStats(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Header title="年度总览" />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <SummaryCardSkeleton key={i} />
            ))}
          </div>
        ) : yearStats.length === 0 ? (
          <EmptyState
            icon={<BarChart3 className="w-12 h-12" />}
            title="暂无数据"
            description="添加教学记录后即可查看年度总览"
          />
        ) : (
          <div>
            {yearStats.map((stat) => (
              <YearCard
                key={stat.year}
                year={stat.year}
                totalPeriod={stat.totalPeriod}
                totalSalary={stat.totalSalary}
                onClick={() => router.push(`/overview/${stat.year}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
