"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/ui/Header";
import MonthCard from "@/components/overview/MonthCard";
import EmptyState from "@/components/shared/EmptyState";
import { SummaryCardSkeleton } from "@/components/ui/Skeleton";
import { BarChart3 } from "lucide-react";

interface MonthStat {
  month: string;
  year: string;
  totalPeriod: number;
  totalSalary: number;
  dayCount: number;
}

export default function MonthOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;

  const [monthStats, setMonthStats] = useState<MonthStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/stats/month?year=${year}`)
      .then((res) => res.json())
      .then((data) => setMonthStats(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year]);

  return (
    <div>
      <Header title={`${year}年 月度总览`} showBack />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SummaryCardSkeleton key={i} />
            ))}
          </div>
        ) : monthStats.length === 0 ? (
          <EmptyState
            icon={<BarChart3 className="w-12 h-12" />}
            title="暂无数据"
            description="该年度暂无教学记录"
          />
        ) : (
          <div>
            {monthStats.map((stat) => (
              <MonthCard
                key={stat.month}
                month={stat.month}
                year={stat.year}
                totalPeriod={stat.totalPeriod}
                totalSalary={stat.totalSalary}
                dayCount={stat.dayCount}
                onClick={() =>
                  router.push(`/overview/${year}/${stat.month}`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
