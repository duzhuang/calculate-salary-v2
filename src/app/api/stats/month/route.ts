import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/stats/month?year=2025
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json(
        { error: "请提供 year 参数" },
        { status: 400 }
      );
    }

    const records = await prisma.record.findMany({
      where: {
        recordDate: { startsWith: year },
      },
    });

    // 按月份分组
    const monthMap = new Map<
      string,
      { totalPeriod: number; totalSalary: number; days: Set<string> }
    >();

    for (const record of records) {
      const month = record.recordDate.substring(5, 7);
      const existing = monthMap.get(month);
      if (existing) {
        existing.totalPeriod += record.classPeriod;
        existing.totalSalary += record.salary;
        existing.days.add(record.recordDate);
      } else {
        monthMap.set(month, {
          totalPeriod: record.classPeriod,
          totalSalary: record.salary,
          days: new Set([record.recordDate]),
        });
      }
    }

    const monthStats = Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        year,
        totalPeriod: Number(data.totalPeriod.toFixed(1)),
        totalSalary: Number(data.totalSalary.toFixed(2)),
        dayCount: data.days.size,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    return NextResponse.json(monthStats);
  } catch (error) {
    console.error("获取月度统计失败:", error);
    return NextResponse.json(
      { error: "获取月度统计失败" },
      { status: 500 }
    );
  }
}
