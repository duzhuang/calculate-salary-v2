import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/stats/year
export async function GET() {
  try {
    const records = await prisma.record.findMany();

    // 按年份分组
    const yearMap = new Map<
      string,
      { totalPeriod: number; totalSalary: number }
    >();

    for (const record of records) {
      const year = record.recordDate.substring(0, 4);
      const existing = yearMap.get(year);
      if (existing) {
        existing.totalPeriod += record.classPeriod;
        existing.totalSalary += record.salary;
      } else {
        yearMap.set(year, {
          totalPeriod: record.classPeriod,
          totalSalary: record.salary,
        });
      }
    }

    const yearStats = Array.from(yearMap.entries())
      .map(([year, data]) => ({
        year,
        totalPeriod: Number(data.totalPeriod.toFixed(1)),
        totalSalary: Number(data.totalSalary.toFixed(2)),
      }))
      .sort((a, b) => b.year.localeCompare(a.year));

    return NextResponse.json(yearStats);
  } catch (error) {
    console.error("获取年度统计失败:", error);
    return NextResponse.json(
      { error: "获取年度统计失败", details: String(error) },
      { status: 500 }
    );
  }
}
