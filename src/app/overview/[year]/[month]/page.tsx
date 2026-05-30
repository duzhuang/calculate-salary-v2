"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import DayCard from "@/components/overview/DayCard";
import RecordItem from "@/components/record/RecordItem";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import { showToast } from "@/components/ui/Toast";
import { Calendar } from "lucide-react";

interface Record {
  id: string;
  recordDate: string;
  weekDay: string;
  studentName: string;
  studentGrade: string;
  subject: string;
  classTimeStart: string;
  classTimeEnd: string;
  classPeriod: number;
  salary: number;
}

interface DayStat {
  date: string;
  totalPeriod: number;
  totalSalary: number;
  recordCount: number;
  records: Record[];
}

export default function DayOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const year = params.year as string;
  const month = params.month as string;

  const [dayStats, setDayStats] = useState<DayStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/stats/day?year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((data) => setDayStats(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year, month]);

  // 删除记录
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/records/${deleteId}`, { method: "DELETE" });

      // 更新本地数据
      setDayStats((prev) =>
        prev
          .map((day) => ({
            ...day,
            records: day.records.filter((r) => r.id !== deleteId),
            totalPeriod: day.records
              .filter((r) => r.id !== deleteId)
              .reduce((sum, r) => sum + r.classPeriod, 0),
            totalSalary: day.records
              .filter((r) => r.id !== deleteId)
              .reduce((sum, r) => sum + r.salary, 0),
            recordCount: day.records.filter((r) => r.id !== deleteId).length,
          }))
          .filter((day) => day.records.length > 0)
      );

      showToast("已删除");
    } catch (error) {
      showToast("删除失败", "error");
    } finally {
      setDeleteId(null);
    }
  };

  // 编辑记录
  const handleEdit = (id: string) => {
    router.push(`/record/${id}`);
  };

  return (
    <div>
      <Header title={`${year}年${parseInt(month)}月 日度详情`} showBack />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : dayStats.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-12 h-12" />}
            title="暂无记录"
            description="该月份暂无教学记录"
          />
        ) : (
          <div>
            {dayStats.map((day) => (
              <div key={day.date} className="mb-4">
                {/* 日期标题 */}
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-sm font-medium text-gray-500">
                    {day.date}
                  </span>
                  <span className="text-xs text-gray-400">
                    课时: {day.totalPeriod}h · 金额: ¥{day.totalSalary}
                  </span>
                </div>

                {/* 记录卡片 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {day.records.map((record) => (
                    <div key={record.id} className="px-4">
                      <RecordItem
                        record={record}
                        onEdit={handleEdit}
                        onDelete={(id) => setDeleteId(id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 删除确认弹窗 */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="删除记录"
        message="确定要删除这条记录吗？"
        confirmText="删除"
        variant="destructive"
      />
    </div>
  );
}
