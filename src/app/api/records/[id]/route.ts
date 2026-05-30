import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateRecordSchema } from "@/lib/validators";
import {
  calculateClassPeriod,
  calculateSalary,
  getWeekDay,
} from "@/lib/constants";

// GET /api/records/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.record.findUnique({ where: { id } });

    if (!record) {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("获取记录失败:", error);
    return NextResponse.json({ error: "获取记录失败" }, { status: 500 });
  }
}

// PUT /api/records/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validated = updateRecordSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "数据校验失败", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;

    // 获取现有记录以合并更新
    const existing = await prisma.record.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    }

    const classTimeStart = data.classTimeStart || existing.classTimeStart;
    const classTimeEnd = data.classTimeEnd || existing.classTimeEnd;
    const studentGrade = data.studentGrade || existing.studentGrade;
    const recordDate = data.recordDate || existing.recordDate;

    const classPeriod = calculateClassPeriod(classTimeStart, classTimeEnd);
    const salary = calculateSalary(studentGrade, classPeriod);
    const weekDay = getWeekDay(recordDate);

    const record = await prisma.record.update({
      where: { id },
      data: {
        ...data,
        weekDay,
        classPeriod,
        salary,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error("更新记录失败:", error);
    return NextResponse.json({ error: "更新记录失败" }, { status: 500 });
  }
}

// DELETE /api/records/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.record.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除记录失败:", error);
    return NextResponse.json({ error: "删除记录失败" }, { status: 500 });
  }
}
