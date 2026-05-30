import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/stats/day?year=2025&month=5
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!year || !month) {
      return NextResponse.json(
        { error: "请提供 year 和 month 参数" },
        { status: 400 }
      );
    }

    const prefix = `${year}-${month.padStart(2, "0")}`;

    const records = await prisma.record.findMany({
      where: {
        recordDate: { startsWith: prefix },
      },
      orderBy: [{ recordDate: "desc" }, { classTimeStart: "asc" }],
    });

    // 按日期分组
    const dayMap = new Map<
      string,
      { totalPeriod: number; totalSalary: number; records: typeof records }
    >();

    for (const record of records) {
      const existing = dayMap.get(record.recordDate);
      if (existing) {
        existing.totalPeriod += record.classPeriod;
        existing.totalSalary += record.salary;
        existing.records.push(record);
      } else {
        dayMap.set(record.recordDate, {
          totalPeriod: record.classPeriod,
          totalSalary: record.salary,
          records: [record],
        });
      }
    }

    const dayStats = Array.from(dayMap.entries())
      .map(([date, data]) => ({
        date,
        totalPeriod: Number(data.totalPeriod.toFixed(1)),
        totalSalary: Number(data.totalSalary.toFixed(2)),
        recordCount: data.records.length,
        records: data.records,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json(dayStats);
  } catch (error) {
    console.error("获取日度统计失败:", error);
    return NextResponse.json(
      { error: "获取日度统计失败" },
      { status: 500 }
    );
  }
}
