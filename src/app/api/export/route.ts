import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  GRADE,
  SUBJECT,
  CLASS_WAY,
  CLASS_TYPE,
  CLASS_MAIN,
} from "@/lib/constants";

// GET /api/export?startDate=2025-05-01&endDate=2025-05-28
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "请提供 startDate 和 endDate 参数" },
        { status: 400 }
      );
    }

    if (startDate > endDate) {
      return NextResponse.json(
        { error: "开始日期不能大于结束日期" },
        { status: 400 }
      );
    }

    const records = await prisma.record.findMany({
      where: {
        recordDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: [{ recordDate: "asc" }, { classTimeStart: "asc" }],
    });

    // 转换为中文字段名
    const exportData = records.map((record) => ({
      日期: record.recordDate,
      星期: record.weekDay,
      学生姓名: record.studentName,
      "正课/试听": CLASS_MAIN[record.classMain] || record.classMain,
      年级: GRADE[record.studentGrade] || record.studentGrade,
      科目: SUBJECT[record.subject] || record.subject,
      授课老师: record.teacherName,
      授课时间: `${record.classTimeStart} - ${record.classTimeEnd}`,
      课时: record.classPeriod,
      上课方式: CLASS_WAY[record.classWay] || record.classWay,
      上课类型: CLASS_TYPE[record.classType] || record.classType,
      薪资: record.salary,
    }));

    return NextResponse.json(exportData);
  } catch (error) {
    console.error("导出数据失败:", error);
    return NextResponse.json({ error: "导出数据失败" }, { status: 500 });
  }
}
