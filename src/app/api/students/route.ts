import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createStudentSchema } from "@/lib/validators";

// GET /api/students
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("获取学生列表失败:", error);
    return NextResponse.json(
      { error: "获取学生列表失败" },
      { status: 500 }
    );
  }
}

// POST /api/students
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = createStudentSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "数据校验失败", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;

    // 检查是否已存在同名同年级学生
    const existing = await prisma.student.findUnique({
      where: {
        name_grade: { name: data.name, grade: data.grade },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "该学生已存在" },
        { status: 409 }
      );
    }

    const student = await prisma.student.create({ data });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("添加学生失败:", error);
    return NextResponse.json({ error: "添加学生失败" }, { status: 500 });
  }
}
