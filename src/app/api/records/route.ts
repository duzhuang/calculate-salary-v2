import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createRecordSchema,
} from "@/lib/validators";
import {
  calculateClassPeriod,
  calculateSalary,
  getWeekDay,
} from "@/lib/constants";

// GET /api/records - 获取记录列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");

    const where: Record<string, unknown> = {};

    if (date) {
      where.recordDate = date;
    } else if (year && month) {
      where.recordDate = {
        startsWith: `${year}-${month.padStart(2, "0")}`,
      };
    } else if (year) {
      where.recordDate = {
        startsWith: year,
      };
    }

    const [records, total] = await Promise.all([
      prisma.record.findMany({
        where,
        orderBy: [{ recordDate: "desc" }, { classTimeStart: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.record.count({ where }),
    ]);

    return NextResponse.json({ records, total, page, limit });
  } catch (error) {
    console.error("获取记录失败:", error);
    return NextResponse.json(
      {
        error: "获取记录失败",
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined,
        env: {
          hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
          hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/records - 创建记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = createRecordSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "数据校验失败", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;
    const classPeriod = calculateClassPeriod(
      data.classTimeStart,
      data.classTimeEnd
    );
    const salary = calculateSalary(data.studentGrade, classPeriod);
    const weekDay = getWeekDay(data.recordDate);

    const record = await prisma.record.create({
      data: {
        ...data,
        weekDay,
        classPeriod,
        salary,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("创建记录失败:", error);
    return NextResponse.json(
      { error: "创建记录失败" },
      { status: 500 }
    );
  }
}
