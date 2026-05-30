"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import RecordCard from "@/components/record/RecordCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import { SummaryCardSkeleton } from "@/components/ui/Skeleton";
import { showToast } from "@/components/ui/Toast";
import { Calendar, PlusCircle } from "lucide-react";
import Link from "next/link";

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
  weekDay: string;
  totalPeriod: number;
  totalSalary: number;
  records: Record[];
}

export default function HomePage() {
  const router = useRouter();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 获取记录
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const [year, month] = currentMonth.split("-");
        const res = await fetch(`/api/records?year=${year}&month=${month}`);
        const data = await res.json();
        setRecords(data.records || []);
      } catch (error) {
        console.error("获取记录失败:", error);
        showToast("获取记录失败", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [currentMonth]);

  // 按日期分组
  const dayStats = useMemo(() => {
    const map = new Map<string, DayStat>();

    for (const record of records) {
      const existing = map.get(record.recordDate);
      if (existing) {
        existing.totalPeriod += record.classPeriod;
        existing.totalSalary += record.salary;
        existing.records.push(record);
      } else {
        map.set(record.recordDate, {
          date: record.recordDate,
          weekDay: record.weekDay,
          totalPeriod: record.classPeriod,
          totalSalary: record.salary,
          records: [record],
        });
      }
    }

    return Array.from(map.values()).sort((a, b) =>
      b.date.localeCompare(a.date)
    );
  }, [records]);

  // 月度汇总
  const monthSummary = useMemo(() => {
    const totalPeriod = records.reduce((sum, r) => sum + r.classPeriod, 0);
    const totalSalary = records.reduce((sum, r) => sum + r.salary, 0);
    const days = new Set(records.map((r) => r.recordDate)).size;
    return { totalPeriod, totalSalary, days };
  }, [records]);

  // 切换月份
  const changeMonth = (delta: number) => {
    const [y, m] = currentMonth.split("-").map(Number);
    const date = new Date(y, m - 1 + delta, 1);
    setCurrentMonth(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    );
  };

  // 删除记录
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/records/${deleteId}`, { method: "DELETE" });
      setRecords((prev) => prev.filter((r) => r.id !== deleteId));
      showToast("删除成功");
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
      <Header
        title="家教薪资助手"
        rightAction={
          <Link
            href="/record"
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-teal-600"
          >
            <PlusCircle className="w-6 h-6" />
          </Link>
        }
      />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* 月份选择器 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-600"
          >
            &lt;
          </button>
          <span className="text-lg font-semibold text-gray-900">
            {currentMonth.replace("-", "年")}月
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-600"
          >
            &gt;
          </button>
        </div>

        {/* 月度汇总 */}
        {loading ? (
          <SummaryCardSkeleton />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
            <div className="text-sm text-gray-500 mb-1">本月收入</div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              ¥{monthSummary.totalSalary.toLocaleString("zh-CN")}
            </div>
            <div className="text-sm text-gray-500">
              课时: {monthSummary.totalPeriod}h &nbsp; 教学: {monthSummary.days}
              天
            </div>
          </div>
        )}

        {/* 记录列表 */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : dayStats.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-12 h-12" />}
            title="暂无教学记录"
            description="点击下方按钮添加第一条记录"
            action={
              <Link
                href="/record"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md"
              >
                <PlusCircle className="w-4 h-4" />
                添加记录
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {dayStats.map((day) => (
              <RecordCard
                key={day.date}
                date={day.date}
                weekDay={day.weekDay}
                totalPeriod={day.totalPeriod}
                totalSalary={day.totalSalary}
                records={day.records}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
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
        message="确定要删除这条记录吗？此操作不可撤销。"
        confirmText="删除"
        variant="destructive"
      />
    </div>
  );
}
